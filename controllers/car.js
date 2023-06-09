import Car from "../models/CarModel.js";

//get all method
export const getCars = async (req, res) => {
  try {
    const car = await Car.findAll({
      attributes: ["carID", "userID", "color", "make", "model", "licensePlate", "selected"],
    });
    res.json(car);
  } catch (error) {
    console.log(error);
  }
};

export const getCarsbyID = async (req, res) => {  
  try {
    const cars = await Car.findAll({
      where: {
        userID: req.body.userID,
      },
      attributes: ["carID", "userID", "color", "make", "model", "licensePlate", "selected"],
    });
    console.log("here");
    if (cars.length === 0) {
      return res.status(404).json({ msg: "No cars found" });
    }

    res.json(cars);
  } catch (error) {
    console.log("oops");
    res.status(400).json({ msg: "something went wrong" });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { carID, userID, make, model, licensePlate, selected } = req.body;
    let updatedCar = {
      carID,
      userID,
      make,
      model,
      licensePlate,
      selected
    };

    
    const car = await Car.findOne({ where: { carID } });
    if (!car) return res.status(404).json({ msg: "Car not found" });


    if (selected == true) {
      await Car.update({ selected: false}, {where: {userID}})
    }
    
    await Car.update(updatedCar, { where: { carID } });
    return res.json({ msg: "Car updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to update Car" });
  }
};

export const Import = async (req, res) => {
  // Get the fields that we are going to register
  const { userID, color, make, model, licensePlate, selected } = req.body;

  try {
    // Update table
    await Car.create({
      userID: userID,
      color: color,
      make: make,
      model: model,
      licensePlate: licensePlate,
      selected: selected
    });
    res.json({ msg: "success import" }); // send a response indicating success
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "import failed" }); // send a response indicating failure
  }
};

//get car by license plate
export const getCarByLicensePlate = async (req, res) => {
  try {
    const car = await Car.findOne({
      where: {
        licensePlate: req.query.licensePlate,
      },
      attributes: ["carID", "userID", "color", "make", "model", "licensePlate", "selected"],
    });
    if (!car) return res.status(404).json({ msg: "Car not found" });
    res.json(car);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to get Car" });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { carID } = req.body;
    const car = await Car.findOne({ where: { carID } });
    if (!car) return res.status(404).json({ msg: "Car not found" });
    await Car.destroy({ where: { carID } });
    return res.json({ msg: "Car deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to delete Car" });
  }
};
