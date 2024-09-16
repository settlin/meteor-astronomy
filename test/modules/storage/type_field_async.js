import {
  Class
}
	from 'meteor/jagi:astronomy';
import {Mongo} from 'meteor/mongo';

Tinytest.add('Modules - Storage - Type field Async', async function(test) {
  const Part = Class.create({
    name: 'Part',
    typeField: 'type',
    fields: {
      name: {
        type: String
      }
    }
  });

  const Engine = Part.inherit({
    name: 'Engine'
  });

  const Wheel = Part.inherit({
    name: 'Wheel'
  });

  const Vehicles = new Mongo.Collection(null);

  const Vehicle = Class.create({
    name: 'Vehicle',
    collection: Vehicles,
    typeField: 'type',
    fields: {
      name: {
        type: String
      },
      parts: {
        type: [Part],
        default () {
          return [];
        }
      }
    }
  });

  const Car = Vehicle.inherit({
    name: 'Car'
  });

  const Plane = Vehicle.inherit({
    name: 'Plane'
  });

  let vehicle = new Vehicle({
    name: 'Vehicle',
    parts: [
      new Engine({
        name: 'Engine'
      }),
      new Wheel({
        name: 'Wheel'
      })
    ]
  });
  await vehicle.saveAsync();

  let plane = new Plane({
    name: 'Plane'
  });
  await plane.saveAsync();

  let car = new Car({
    name: 'Car'
  });
  await car.saveAsync();

  let vehicles = await Vehicle.find().fetchAsync();
  test.equal(vehicles.length, 3,
    'All child documents should be fetched'
  );
  test.instanceOf(vehicles[0], Vehicle,
    'First document should be instance of the "Vehicle" class'
  );
  test.instanceOf(vehicles[1], Plane,
    'Second document should be instance of the "Plane" class'
  );
  test.instanceOf(vehicles[2], Car,
    'Second document should be instance of the "Car" class'
  );
  vehicles = Vehicle.find({}, {
    children: false
  }).fetchAsync();
  test.equal(vehicles.length, 1,
    'Only one document should be fetched'
  );
  test.instanceOf(vehicles[0], Vehicle,
    'First document should be instance of the "Vehicle" class'
  );
  test.instanceOf(vehicles[0].parts[0], Engine,
    'First nested document should be instance of the "Engine" class'
  );
  test.instanceOf(vehicles[0].parts[1], Wheel,
    'Second nested document should be instance of the "Wheel" class'
  );
});