// ==UserScript==
// @name         Trygg-Hansa Tealium Payload Logger
// @namespace    local.tealium.debug
// @version      1.0
// @description  Logs only the explicit payload supplied to utag.view() and utag.link()
// @match        https://www.trygghansa.se/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  const w = unsafeWindow;
  const POLL_INTERVAL_MS = 250;
  const MAX_WAIT_MS = 30000;

  const ignoredPrefixes = [
    'cp.',
    'dom.',
    'meta.',
    'js_page.',
    'va.',
    'qp.',
    'ls.',
    'ss.'
  ];

  const ignoredExactKeys = [
    'ut.event',
    'ut.domain',
    'ut.version',
    'ut.env',
    'ut.profile',
    'ut.account',
    'ut.visitor_id',
    'ut.session_id',
    'ut.event_id',
    '__fromTealium'
  ];

  function shouldIgnoreKey(key) {
    return (
      ignoredExactKeys.includes(key) ||
      (key.startsWith('tealium_') && key !== 'tealium_event') ||
      ignoredPrefixes.some(prefix => key.startsWith(prefix))
    );
  }

  function sortPayloadEntries([keyA], [keyB]) {
    if (keyA === 'tealium_event') {
      return -1;
    }

    if (keyB === 'tealium_event') {
      return 1;
    }

    return keyA.localeCompare(keyB);
  }

  let initialUtagDataLogged = false;
  let initialUtagDataBaseline = null;

  function captureInitialUtagData() {
    if (!initialUtagDataBaseline && w.utag_data && typeof w.utag_data === 'object') {
      initialUtagDataBaseline = clone(w.utag_data);
    }
  }

  function isBaselineKey(key) {
    return (
      key !== 'tealium_event' &&
      initialUtagDataBaseline &&
      Object.prototype.hasOwnProperty.call(initialUtagDataBaseline, key)
    );
  }

  function cleanPayload(payload, options = {}) {
    if (!payload || typeof payload !== 'object') {
      return payload;
    }

    return Object.fromEntries(
      Object.entries(payload)
        .filter(([key]) => !shouldIgnoreKey(key))
        .filter(([key]) => !options.excludeInitialUtagData || !isBaselineKey(key))
        .sort(sortPayloadEntries)
    );
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }

  function formatTableValue(value) {
    if (value === undefined) {
      return 'undefined';
    }

    if (value === null) {
      return 'null';
    }

    if (Array.isArray(value) || typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    return String(value);
  }

  function formatPayloadTableLog(label, payload) {
    const rows = payload && typeof payload === 'object'
      ? Object.entries(payload)
      : [['(value)', payload]];

    const keyHeader = 'key';
    const valueHeader = 'value';
    const keyWidth = Math.max(
      keyHeader.length,
      ...rows.map(([key]) => String(key).length)
    );
    const valueWidth = Math.max(
      valueHeader.length,
      ...rows.map(([, value]) => formatTableValue(value).length)
    );
    const separator = `${'-'.repeat(keyWidth)}  ${'-'.repeat(valueWidth)}`;
    const lines = [
      `\n+++ ${label}`,
      `${keyHeader.padEnd(keyWidth)}  ${valueHeader}`,
      separator
    ];
    const boldLineIndexes = [];

    rows.forEach(([key, value]) => {
      if (key === 'tealium_event') {
        boldLineIndexes.push(lines.length);
      }

      lines.push(`${String(key).padEnd(keyWidth)}  ${formatTableValue(value)}`);
    });

    lines.push('');

    if (!boldLineIndexes.length) {
      return [lines.join('\n')];
    }

    const formatParts = [];
    const styles = [];

    lines.forEach((line, index) => {
      if (index > 0) {
        formatParts.push('\n');
      }

      if (boldLineIndexes.includes(index)) {
        formatParts.push('%c', line, '%c');
        styles.push('font-weight: bold;', 'font-weight: normal;');
      } else {
        formatParts.push(line);
      }
    });

    return [formatParts.join(''), ...styles];
  }

  function logCleanPayload(label, payload, options = {}) {
    const rawPayload = clone(payload || {});
    const cleanedPayload = cleanPayload(rawPayload, options);

    console.log(...formatPayloadTableLog(`${label}`, cleanedPayload));
  }

  function logEvent(type, suppliedPayload, callback, uidArray) {
    captureInitialUtagData();
    logCleanPayload(type, suppliedPayload, { excludeInitialUtagData: true });
  }

  function logInitialUtagData() {
    if (initialUtagDataLogged || !w.utag_data || typeof w.utag_data !== 'object') {
      return;
    }

    captureInitialUtagData();
    initialUtagDataLogged = true;
    logCleanPayload('initial utag_data\n', w.utag_data);
  }

  function install() {
    if (!w.utag || typeof w.utag.view !== 'function' || typeof w.utag.link !== 'function') {
      return false;
    }

    if (w.utag.__payload_logger_installed) {
      return true;
    }

    const originalView = w.utag.view;
    const originalLink = w.utag.link;

    w.utag.view = function (data, callback, uidArray) {
      logEvent('utag.view()\n', data, callback, uidArray);
      return originalView.apply(this, arguments);
    };

    w.utag.link = function (data, callback, uidArray) {
      logEvent('utag.link()\n', data, callback, uidArray);
      return originalLink.apply(this, arguments);
    };

    w.utag.__payload_logger_installed = true;

    console.log('[Tealium Payload Logger] Installed');

    return true;
  }

  const startedAt = Date.now();

  const timer = setInterval(() => {
    logInitialUtagData();

    const installed = install();
    const timedOut = Date.now() - startedAt > MAX_WAIT_MS;

    if (installed || timedOut) {
      clearInterval(timer);

      if (timedOut && !w.utag?.__payload_logger_installed) {
        console.warn('[Tealium Payload Logger] Timed out waiting for utag');
      }
    }
  }, POLL_INTERVAL_MS);

  logInitialUtagData();
})();
