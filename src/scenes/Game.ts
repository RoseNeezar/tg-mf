import Phaser, { Cameras } from "phaser";

import { createCharacterAnims } from "../anims/CharacterAnims";
import { createLizardAnims } from "../anims/EnemyAnims";
import { createChestAnims } from "../anims/TreasureAnims";
import * as EasyStar from "easystarjs";
import Lizard from "../enemies/Lizard";

import "../characters/Faune";
import Faune from "../characters/Faune";

import { sceneEvents } from "../events/EventsCenter";
import Chest from "../items/Chest";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;
  player!: Faune;

  private knives!: Phaser.Physics.Arcade.Group;
  private lizards!: Phaser.Physics.Arcade.Group;

  private playerLizardsCollider?: Phaser.Physics.Arcade.Collider;
  camera!: Cameras.Scene2D.Camera;
  finder!: EasyStar.js;
  map!: Phaser.Tilemaps.Tilemap;
  scene!: any;
  marker!: Phaser.GameObjects.Graphics;

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBounds(0, 0, 20 * 32, 20 * 32);
    this.finder = new EasyStar.js();

    this.scene.run("game-ui");

    createCharacterAnims(this.anims);
    createLizardAnims(this.anims);
    createChestAnims(this.anims);

    this.map = this.make.tilemap({ key: "dungeon" });
    const tileset = this.map.addTilesetImage("dungeon", "tiles", 16, 16, 1, 2);

    // @ts-ignore
    this.map.createStaticLayer("Ground", tileset);

    let grid = [];
    for (let y = 0; y < this.map.height; y++) {
      let col = [];
      for (let x = 0; x < this.map.width; x++) {
        // In each cell we store the ID of the tile, which corresponds
        // to its index in the tileset of the map ("ID" field in Tiled)
        col.push(this.getTileID(x, y));
      }
      grid.push(col);
    }

    this.finder.setGrid(grid as number[][]);

    let tilesetDD = this.map.tilesets[0];
    let properties = tilesetDD.tileProperties as any;
    let acceptableTiles = [];

    // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
    // and see what properties have been entered in Tiled.
    for (let i = tilesetDD.firstgid - 1; i < tileset.total; i++) {
      // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
      if (!properties.hasOwnProperty(i)) {
        // If there is no property indicated at all, it means it's a walkable tile
        acceptableTiles.push(i + 1);
        continue;
      }
      if (!properties[i].collide) acceptableTiles.push(i + 1);
      if (properties[i].cost)
        this.finder.setTileCost(i + 1, properties[i].cost); // If there is a cost attached to the tile, let's register it
    }
    this.finder.setAcceptableTiles(acceptableTiles);

    this.marker = this.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3,
    });

    this.faune = this.add.faune(32, 32, "faune");
    this.faune.setDepth(1);
    this.faune.setOrigin(0, 0.5);
    this.camera.startFollow(this.faune);
    this.faune.setKnives(this.knives);
    this.player = this.faune;

    this.input.on("pointerup", (e: any) => this.handleClick(e, this.faune));
    // @ts-ignore
    const wallsLayer = this.map.createStaticLayer("Walls", tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    const chests = this.physics.add.staticGroup({
      classType: Chest,
    });
    const chestsLayer = this.map.getObjectLayer("Chests");
    chestsLayer.objects.forEach((chestObj) => {
      chests.get(
        chestObj.x! + chestObj.width! * 0.5,
        chestObj.y! - chestObj.height! * 0.5,
        "treasure"
      );
    });

    this.cameras.main.startFollow(this.faune, true);

    this.lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizGo = go as Lizard;
        lizGo.body.onCollide = true;
      },
    });

    const lizardsLayer = this.map.getObjectLayer("Lizards");
    lizardsLayer.objects.forEach((lizObj) => {
      this.lizards.get(
        lizObj.x! + lizObj.width! * 0.5,
        lizObj.y! - lizObj.height! * 0.5,
        "lizard"
      );
    });

    this.physics.add.collider(this.faune, wallsLayer);
    this.physics.add.collider(this.lizards, wallsLayer);

    this.physics.add.collider(
      this.faune,
      chests,
      this.handlePlayerChestCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.knives,
      wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeLizardCollision,
      undefined,
      this
    );

    this.playerLizardsCollider = this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
  }

  handleClick(pointer: any, buto: any) {
    console.log(this.player);
    if (!this.faune) return;
    console.log(pointer, pointer.position.x, this.cameras.main.scrollX);
    const x = this.cameras.main.scrollX + pointer?.position?.x;
    const y = this.cameras.main.scrollY + pointer?.position?.y;

    const toX = Math.floor(x / 16);
    const toY = Math.floor(y / 16);
    const fromX = Math.floor(this.faune.x / 16);
    const fromY = Math.floor(this.faune.y / 16);
    console.log(
      "going from (" + fromX + "," + fromY + ") to (" + toX + "," + toY + ")"
    );

    this.finder.findPath(fromX, fromY, toX, toY, (path) => {
      if (path === null) {
        console.warn("Path was not found.");
      } else {
        console.log(path);
        this.moveCharacter(path);
      }
    });
    this.finder.calculate(); // don't forget, otherwise nothing happens
  }

  private handlePlayerChestCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const chest = obj2 as Chest;
    this.faune.setChest(chest);
  }

  private handleKnifeWallCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
  }

  private handleKnifeLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
    this.lizards.killAndHide(obj2);
  }

  private handlePlayerLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    console.log("cb-", this.faune);
    const lizard = obj2 as Lizard;

    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handleDamage(dir);

    sceneEvents.emit("player-health-changed", this.faune.health);

    if (this.faune.health <= 0) {
      this.playerLizardsCollider?.destroy();
    }
  }
  moveCharacter(path: any[]) {
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
    let tweens = [];
    for (let i = 0; i < path.length - 1; i++) {
      let ex = path[i + 1].x;
      let ey = path[i + 1].y;
      tweens.push({
        targets: this.faune,
        x: { value: ex * this.map.tileWidth, duration: 200 },
        y: { value: ey * this.map.tileHeight, duration: 200 },
      });
    }

    this.tweens.timeline({
      tweens: tweens,
    });
  }
  checkCollision(x: number, y: number) {
    const tile = this.map.getTileAt(x, y);
    if (!tile) return;
    return tile.properties.collide === true;
  }
  getTileID(x: number, y: number) {
    const tile = this.map.getTileAt(x, y);

    if (!tile) return;
    return tile.index;
  }

  update(t: number, dt: number) {
    const worldPoint = this.input.activePointer.positionToCamera(
      this.cameras.main
    ) as Phaser.Math.Vector2;

    // Rounds down to nearest tile
    const pointerTileX = this.map.worldToTileX(worldPoint.x);
    const pointerTileY = this.map.worldToTileY(worldPoint.y);
    this.marker.x = this.map.tileToWorldX(pointerTileX);
    this.marker.y = this.map.tileToWorldY(pointerTileY);
    this.marker.setVisible(!this.checkCollision(pointerTileX, pointerTileY));
    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}
