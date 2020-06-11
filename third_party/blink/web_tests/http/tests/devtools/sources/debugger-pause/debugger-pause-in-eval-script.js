// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

(async function() {
  TestRunner.addResult(
      `Tests that debugger will stop on "debugger" statement in a function that was added to the inspected page via evaluation in Web Inspector console.`);
  await TestRunner.loadModule('sources_test_runner');
  await TestRunner.loadModule('console_test_runner');
  await TestRunner.showPanel('sources');
  var scriptToEvaluate = 'function testFunction() {\n' +
      '    debugger;\n' +
      '}\n' +
      'setTimeout(testFunction, 0);\n';

  SourcesTestRunner.startDebuggerTest(step1);

  async function step1() {
    await ConsoleTestRunner.evaluateInConsolePromise(scriptToEvaluate);
    SourcesTestRunner.waitUntilPaused(step2);
  }

  function step2(callFrames) {
    SourcesTestRunner.captureStackTrace(callFrames);
    SourcesTestRunner.completeDebuggerTest();
  }
})();