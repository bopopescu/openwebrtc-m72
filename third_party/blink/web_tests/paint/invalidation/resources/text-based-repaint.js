// Asynchronous tests should manually call finishRepaintTest at the appropriate
// time.
window.testIsAsync = false;
window.outputRepaintRects = true;

// All repaint tests are asynchronous.
if (window.testRunner)
    testRunner.waitUntilDone();

if (window.internals)
    internals.runtimeFlags.paintUnderInvalidationCheckingEnabled = true;

// Add string names of objects that should be invalidated here. If you use this feature,
// you must also include testharness.js.
window.expectedObjectInvalidations = [];
// Objects which must *not* be invalidated.
window.expectedObjectNonInvalidations = [];

function runRepaintTest()
{
    if (!window.testRunner || !window.internals) {
        setTimeout(repaintTest, 500);
        return;
    }

    if (window.enablePixelTesting)
        testRunner.dumpAsTextWithPixelResults();
    else
        testRunner.dumpAsText();

    testRunner.layoutAndPaintAsyncThen(function() {
        internals.startTrackingRepaints(top.document);
        repaintTest();
        if (!window.testIsAsync)
            finishRepaintTest();
    });
}

function runRepaintAndPixelTest()
{
    window.enablePixelTesting = true;
    runRepaintTest();
}

function forceStyleRecalc()
{
    if (document.body)
        document.body.clientTop;
    else if (document.documentElement)
        document.documentElement.clientTop;
}

function finishRepaintTest()
{
    if (!window.testRunner || !window.internals)
        return;

    // Force a style recalc.
    forceStyleRecalc();

    var flags = internals.LAYER_TREE_INCLUDES_PAINT_INVALIDATIONS;

    if (window.layerTreeAsTextAdditionalFlags)
        flags |= layerTreeAsTextAdditionalFlags;

    var layersWithInvalidationsText = internals.layerTreeAsText(top.document, flags);

    internals.stopTrackingRepaints(top.document);

    // Play nice with JS tests which may want to print out assert results.
    if (window.isJsTest)
        window.outputRepaintRects = false;

    if (window.outputRepaintRects)
        testRunner.setCustomTextOutput(layersWithInvalidationsText);

    if (window.afterTest)
        window.afterTest();

    // Play nice with async JS tests which want to notifyDone themselves.
    if (!window.jsTestIsAsync)
        testRunner.notifyDone();
}