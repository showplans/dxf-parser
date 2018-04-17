
var helpers = require('../ParseHelpers');

module.exports = EntityParser;

function EntityParser() {}

EntityParser.ForEntityName = 'MTEXT';

EntityParser.prototype.parseEntity = function(scanner, curr) {
    var initialEntity = {
        type: curr.value
    };
		curr = scanner.next();

    while(curr !== 'EOF') {
        if(curr.code === 0) break;

        switch(curr.code) {
            case 1:
                initialEntity.text = curr.value;
                break;
            case 3:
                initialEntity.text += curr.value;
                break;
            case 10:
                initialEntity.position = helpers.parsePoint(scanner);
                break;
            case 11:
                initialEntity.directionalVector = helpers.parsePoint(scanner);
                break;
            case 40:
                //Note: this is the text height
                initialEntity.height = curr.value;
                break;
            case 41:
                initialEntity.width = curr.value;
                break;
            case 50:
                initialEntity.rotation = curr.value;
                break;
            case 71:
                initialEntity.attachmentPoint = curr.value;
                break;
            case 72:
                initialEntity.drawingDirection = curr.value;
                break;
            default:
                helpers.checkCommonEntityProperties(initialEntity, curr);
                break;
        }
        curr = scanner.next();
    }

    // Post scanning calculating of things
    var entity = Object.assign(initialEntity, {
        // Return a XY rotation if we have the direction vector values for x and y in degrees
        rotationXY: initialEntity.directionalVector
            ? Math.atan(initialEntity.directionalVector.y/initialEntity.directionalVector.x) * (180/Math.PI)
            :0,
        // Return a YZ rotation if we have the direction vector values for z and y in degrees
        rotationYZ: initialEntity.directionalVector
            ? Math.atan(initialEntity.directionalVector.z/initialEntity.directionalVector.y) * (180/Math.PI)
            :0,
        // Return a ZX rotation if we have the direction vector values for x and z in degrees
        rotationZX: initialEntity.directionalVector
            ? Math.atan(initialEntity.directionalVector.x/initialEntity.directionalVector.z) * (180/Math.PI)
            :0
    });

    return entity;
};