const { Tax } = require('../models/index.js');

module.exports = {
  createTax: (req, res) => {
    Tax.create({
      name: req.body.name,
      taxCode: req.body.taxCode,
      price: req.body.price,
      userId: req.user.id 
    })
      .then(({ dataValues }) => {
       res.status(201).json({
         data: dataValues,
         info: "Tax object is successfully created"
       })
      })
      .catch((err) => {
       if (err.errors) {
         const { errors } = err;
         let errorMessage = "";
         errors.forEach((error) => {
           errorMessage += error.message + ","
         })
 
         errorMessage = errorMessage.substring(0, errorMessage.length - 1)
 
         res.status(400).json({
          info: "Failed to create tax data",
          err:   errorMessage
        }) 
       } else {
         res.status(500).json({
           info: "Failed to create tax data",
           err: "Please try again later!"
         })
       }
      })
  },

  getUserBill: (req, res) => {
    Tax.findAll({
      where: {
        userId: req.user.id
      }
    })
      .then((data) => {
          const dataFromDb = data.map((datum) => datum.dataValues);

          if (dataFromDb.length > 0) {
            let subTotalPrice = 0;
            let subTotalTax = 0;
            let grandTotal = 0;
            let bill = {};
            bill.items = dataFromDb.map((datum) => {
              if (datum.taxCode === 1) {
                datum.type = 'Food and Beverage';
                datum.refundable = 'Yes';
                datum.tax =  0.1  * datum.price;
              } else if (datum.taxCode === 2) {
                datum.type = 'Tobacco';
                datum.refundable = 'No';
                datum.tax = 10 + (0.02 * datum.price);    
              } else { 
                datum.type = 'Entertainment';
                datum.refundable = 'No';
              
                if (datum.price >= 100) {
                  datum.tax =  0.01 * (datum.price - 100);
                }
              }
    
              subTotalPrice += datum.price;
              subTotalTax += datum.tax;
              grandTotal += datum.tax + datum.price;
              delete datum.createdAt;
              delete datum.updatedAt;
    
              return datum;
            })
    
            bill.subTotalPrice = subTotalPrice;
            bill.subTotalTax = subTotalTax;
            bill.grandTotal = grandTotal;

            res.status(200).json({
              data: bill,
              info: "Successully get user tax data"
            })
        } else {
          res.status(404).json({
            info: 'No data found'
          })
        }
      })
      .catch((err) => {
        res.status(500).json({
          info: 'Failed to get tax data',
          err: 'Please try again later!'
        })
      })
  }
}