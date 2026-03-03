---
title: "Reducing Tealium Visitor Attributes from 700 to 350: A Practical Optimisation Pattern"
description: "A practical optimisation pattern for mature Tealium AudienceStream implementations that reduces attribute sprawl and improves performance without sacrificing functionality."
date: "20 Sep 2025"
---

I have recently completed a Tealium clean-up project for a major airline in Australia. Their AudienceStream implementation was quite mature, built up over many years, with several abandoned components and unclear ownership.

Trimary issue we were addressing what the number of visitor attributes — the account had over 700, which was causing noticeable UI slowdowns (Tealium recommends keeping it under 500).

Beyond the obvious identification and removal of unused attributes, I have discovered a very effective optimisation pattern that allowed us to additionally nearly halve the overall attribute count. Although very simple in hindsight, it wasn’t obvious at first, so I thought I’d share it here for anyone going through a similar exercise.

## Step 1: Remove unused attributes

The first and most obvious step was to identify and remove unused attributes. Attributes with no dependencies can usually be deleted safely. A quick way to check is to click the delete button on an attribute. If a simple confirmation dialog appears, it has no dependencies and can be deleted. If a dependency warning appears, it is being used somewhere and should not be deleted.

This step allowed us to remove 60 unused attributes, but in our case it was not enough.

## The pattern: One use case, many badges

When analysing the remaining attributes, a clear pattern candidate for optimisation emerged: there were multiple groups of badge attributes built around the same use case, each differing only by a single parameter.

For example, the airline had a series of badges assigned to customers with upcoming flights to specific destinations: Sydney, San Francisco, Tokyo... There were 35 destination badges, one for each major destination. Each badge was used as a condition in a corresponding audience, which then triggered a destination-specific connector.

![Tealium visitor attributes reduction pattern - before](/images/reducing-tealium-visitor-attributes-optimisation-pattern-before.png)

Tealium’s training materials recommend this approach, so it is very common and is fine for smaller implementations. However, as the number of attributes grows over time, this becomes a great candidate for optimisation.

## The optimisation: Replace badges with a Set of Strings

The solution was pretty simple but required a bit of effort and care to implement: instead of maintaining individual badges for each upcoming destination, we replaced them with a single "Upcoming Flight Destinations" Set of Strings attribute that stores all upcoming destinations a customer has bookings for.

The related audiences were then restructured to check whether that Set of Strings contains a specific destination value, rather than checking whether an individual destination badge is assigned.

![Tealium visitor attributes reduction pattern - after](/images/reducing-tealium-visitor-attributes-optimisation-pattern-after.png)

## Result

This pattern was not limited to upcoming flights. There were several other use cases built using the same multi-badge structure, each differing only by a single parameter. By consolidating these into catch-all Set of Strings attributes, we were able to remove entire groups of redundant attributes without losing any functionality, and using this technique alone reduced the total number of visitor attributes from 650 to 350.

The result was not only a significantly leaner data model, but also a noticeably more responsive and stable UI.

If you are going through a similar clean-up exercise, this type of consolidation is often where the largest gains can be found with relatively small effort.


_This article was originally cross-posted to the [Tealium Community](https://community.tealiumiq.com)._