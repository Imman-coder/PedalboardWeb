var mobileModeEnabled = false;

const canvasElement = document.getElementById("mycanvas");
let lastTouch;
let currentDraggingOrSelecting;
let fir;

function handleTouchStart(e) {
  if (e.touches.length > 1) return;
  currentDraggingOrSelecting = "dragging";
  const touch = e.touches[0];
  lastTouch = touch;
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  canvasElement.dispatchEvent(mouseEvent);
}
function handleTouchMove(e) {
  const touch = e.touches[0];
  lastTouch = touch;

  const mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  canvasElement.dispatchEvent(mouseEvent);
  e.preventDefault();
}
function handleTouchEnd(e) {
  const touch = lastTouch;
  console.log(touch);

  const mouseEvent = new MouseEvent("mouseup", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  lastTouch = undefined;
  lastDist = null;
  canvasElement.dispatchEvent(mouseEvent);
  e.preventDefault();
}
function handleTouchMove2(e) {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (lastDist) {
      const zoom = dist / lastDist;
      canvas.ds.scale *= zoom; // apply zoom
      canvas.draw(true, true);
    }
    lastDist = dist;
    e.preventDefault();
  }
}
function handleContextMenu(e) {
  console.log("context");
  const touch = lastTouch;
  console.log(touch);
  currentDraggingOrSelecting = "context";
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY,
    which: 3,
  });

  canvasElement.dispatchEvent(mouseEvent);

  e.preventDefault();
  e.stopPropagation();
  return false;
}

function enableMobileMode() {
  if (mobileModeEnabled) return;
  console.log("mobile mode enabled");
  mobileModeEnabled = true;
  canvasElement.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });

  canvasElement.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });

  canvasElement.addEventListener("touchend", handleTouchEnd, {
    passive: false,
  });

  let lastDist;

  canvasElement.addEventListener("touchmove", handleTouchMove2, {
    passive: false,
  });

  canvasElement.addEventListener("contextmenu", handleContextMenu);
}

function disableMobileMode() {
  if (!mobileModeEnabled) return;
  console.log("mobile mode disabled");
  mobileModeEnabled = false;

  const canvasElement = document.getElementById("mycanvas");

  canvasElement.removeEventListener("touchstart", handleTouchStart);
  canvasElement.removeEventListener("touchmove", handleTouchMove);
  canvasElement.removeEventListener("touchend", handleTouchEnd);
  canvasElement.removeEventListener("touchmove", handleTouchMove2);
  canvasElement.removeEventListener("contextmenu", handleContextMenu);
}
function hookAllEvents(element) {
  // Common DOM events to track
  const events = [
    "click",
    "dblclick",
    "mousedown",
    "mouseup",
    "mousemove",
    "mouseover",
    "mouseout",
    "mouseenter",
    "mouseleave",
    "keydown",
    "keyup",
    "keypress",
    "touchstart",
    "touchmove",
    "touchend",
    "touchcancel",
    "wheel",
    "scroll",
    "contextmenu",
    "gesturestart",
    "gesturechange",
    "gestureend",
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
    "pointerover",
    "pointerout",
    "pointerenter",
    "pointerleave",
  ];

  events.forEach((ev) => {
    element.addEventListener(
      ev,
      function (e) {
        console.log(`[${ev}]`, {
          type: e.type,
          target: e.target,
          touches: e.touches
            ? [...e.touches].map((t) => ({ x: t.clientX, y: t.clientY }))
            : undefined,
          button: e.button,
          buttons: e.buttons,
          clientX: e.clientX,
          clientY: e.clientY,
          key: e.key,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
          metaKey: e.metaKey,
        });
      },
      { passive: false }
    );
  });
}

// hookAllEvents(canvas.canvas);

const userAgent = navigator.userAgent.toLowerCase();
const isTablet =
  /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
    userAgent
  );
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
const mm = JSON.parse(localStorage.getItem("mobileMode"));
console.log(mm);
document.getElementById("mobile-mode").checked = mm;

if (isMobile || isTablet || mm) {
  console.log("Mobile device detected");
  enableMobileMode();
} else {
  console.log("Not a mobile device");
}

function mobileModeChanged(e) {
  localStorage.setItem("mobileMode", e.checked);
  if (e.checked) {
    enableMobileMode();
  } else {
    disableMobileMode();
  }
}
