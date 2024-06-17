// floorExplode.js

function getFloorOffsetZ(fragMiddleZ, scale, levels, globalOffsetZ) {
  for (const key in levels) {
    const level = levels[key];
    // If the middle of the fragment is below the top of the level
    if (fragMiddleZ < level.elevation + level.height - globalOffsetZ) {
      return key * scale;
    }
  }
}

function floorExplode(viewer, scale, levels) {
  // We'll just use the AEC Model Data of the first model
  // If multiple models are loaded, they probably have that in common
  // You could also use the AEC Model Data of a specific model
  for (const model of viewer.getAllModels()) {
    const fragList = model.getFragmentList();
    let pt = new THREE.Vector3();

    const boxes = fragList.fragments.boxes;
    for (const fragId in fragList.fragments.fragId2dbId) {
      const fragIdInt = parseInt(fragId);
      if (scale == 0) {
        fragList.updateAnimTransform(fragIdInt);
      } else {
        const box_offset = fragIdInt * 6;

        const fragMiddleZ = (boxes[box_offset + 2] + boxes[box_offset + 5]) / 2;
        pt.z = getFloorOffsetZ(fragMiddleZ, scale, levels, model.myData.globalOffset.z);

        fragList.updateAnimTransform(fragIdInt, null, null, pt);
      }
    }
  }
}