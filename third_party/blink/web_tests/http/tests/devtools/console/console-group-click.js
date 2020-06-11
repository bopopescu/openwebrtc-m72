// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

(async function() {
  TestRunner.addResult(`Tests that clicks on console.group target the appropriate element.\n`);

  await TestRunner.loadModule('console_test_runner');
  await TestRunner.showPanel('console');

  await TestRunner.evaluateInPagePromise(`
    console.groupCollapsed("group with object", {x: 1});
    console.log("Message inside group");
    console.groupEnd();
  `);
  const messagesElement = Console.ConsoleView.instance()._messagesElement;

  TestRunner.addResult(`\nBefore`);
  ConsoleTestRunner.dumpConsoleMessages();

  TestRunner.addResult(`\nClick on the group`);
  messagesElement.querySelector('.console-group-title').click();
  ConsoleTestRunner.dumpConsoleMessages();

  TestRunner.addResult(`\nClick on the object`);
  messagesElement.querySelector('.console-object').click();
  ConsoleTestRunner.waitForRemoteObjectsConsoleMessages(() => {
    ConsoleTestRunner.dumpConsoleMessages();
    TestRunner.completeTest();
  });
})();