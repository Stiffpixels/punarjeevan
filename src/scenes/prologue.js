import {
  colorizeBackground,
  playAnimIfNotPlaying,
  renderDialogue,
} from "../utils.js";

export default function prologue(k) {
  colorizeBackground(k, 20, 16, 19);
  k.camPos(k.vec2(k.center().x + 168, k.center().y + 128));
  k.camScale(3);
  const scene = k.add([
    k.sprite("cityCutscene", { anim: "city-scene-idle" }),
    k.pos(k.center()),
  ]);

  const prologueLines = [
    "Man I am such a failure, just got fired off of my 10th job, did'nt even make any new friends at the new office.[Press SPACE to continue]",
    "Even my old friends contact me rarely now, where did I go wrong.",
    "Whatever, Lets just drink the night away",
    "Thats if I can cross this road first kinda feel dizzy maybe drank too much.",
  ];
  let countOfSpaceClicks = 0;

  renderDialogue(k, prologueLines, {
    x: k.center().x + 7,
    y: k.center().y + 215,
  });

  const endingSceneSequence = k.onKeyPress("space", async () => {
    countOfSpaceClicks++;
    if (countOfSpaceClicks === prologueLines.length) {
      await k.wait(1);
      playAnimIfNotPlaying(scene, "city-scene2");
      await k.wait(0.5);
      playAnimIfNotPlaying(scene, "city-scene-end");
      await k.wait(1);
      k.go("overWorld");
      endingSceneSequence.cancel();
    }
  });
}
