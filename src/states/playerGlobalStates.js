const getPlayerStates = () => {
  let instance = null;
  const playerStates = () => {
    let isSwordEquipped = true;
    let prevScene = "";
    let mageDefeated = false;
    let playerDamage = 0;
    let demonDefeated = false;

    return {
      set swordEquipped(bool) {
        isSwordEquipped = bool;
      },
      get swordEquipped() {
        return isSwordEquipped;
      },
      set prevScene(scene) {
        prevScene = scene;
      },
      get prevScene() {
        return prevScene;
      },
      set setMageDefeated(bool) {
        mageDefeated = bool;
      },
      get getMageDefeated() {
        return mageDefeated;
      },
      set setDemonDefeated(bool) {
        demonDefeated = bool;
      },
      get getDemonDefeated() {
        return demonDefeated;
      },
      set setPlayerDamage(damage) {
        playerDamage = damage;
      },
      get getPlayerDamage() {
        return playerDamage;
      },
    };
  };
  return {
    getInstance: () => {
      if (!instance) {
        instance = playerStates();
      }
      return instance;
    },
  };
};

export default getPlayerStates;
