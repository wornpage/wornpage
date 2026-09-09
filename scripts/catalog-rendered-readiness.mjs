function sampleContained(sample) {
  return sample.left >= 0
    && sample.top >= 0
    && sample.right <= sample.viewportWidth
    && sample.bottom <= sample.viewportHeight;
}

export function renderedSampleStatus(sample) {
  return {
    contained: sampleContained(sample),
    opaque: sample.opacity === '1',
    animationsSettled: sample.animations.every(({ pending, playState }) => !pending && (playState === 'finished' || playState === 'idle')),
  };
}

export async function observeRenderedReadiness(locator, { maxFrames = 60, stableFrames = 2 } = {}) {
  return locator.evaluate(async (node, options) => {
    const read = (frame) => {
      const box = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        frame,
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
        viewportWidth: innerWidth,
        viewportHeight: innerHeight,
        opacity: style.opacity,
        transform: style.transform,
        animations: node.getAnimations({ subtree: true }).map((animation) => ({
          currentTime: animation.currentTime,
          pending: animation.pending,
          playState: animation.playState,
          playbackRate: animation.playbackRate,
        })),
      };
    };
    const isContained = (sample) => sample.left >= 0
      && sample.top >= 0
      && sample.right <= sample.viewportWidth
      && sample.bottom <= sample.viewportHeight;
    const isStable = (current, previous) => previous
      && Math.abs(current.left - previous.left) < 0.01
      && Math.abs(current.top - previous.top) < 0.01
      && Math.abs(current.right - previous.right) < 0.01
      && Math.abs(current.bottom - previous.bottom) < 0.01
      && current.opacity === previous.opacity
      && current.transform === previous.transform;
    const animationsSettled = (sample) => sample.animations.every(
      ({ pending, playState }) => !pending && (playState === 'finished' || playState === 'idle'),
    );

    const samples = [];
    let consecutiveStableFrames = 0;
    let previous = null;
    for (let frame = 0; frame <= options.maxFrames; frame += 1) {
      if (frame > 0) await new Promise((resolve) => requestAnimationFrame(resolve));
      const current = read(frame);
      samples.push(current);
      consecutiveStableFrames = isStable(current, previous) ? consecutiveStableFrames + 1 : 0;
      previous = current;
      if (
        consecutiveStableFrames >= options.stableFrames
        && animationsSettled(current)
        && isContained(current)
        && current.opacity === '1'
      ) {
        return { ready: true, consecutiveStableFrames, final: current, samples };
      }
    }
    return { ready: false, consecutiveStableFrames, final: samples.at(-1), samples };
  }, { maxFrames, stableFrames });
}
