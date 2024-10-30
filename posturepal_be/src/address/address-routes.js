const express = require('express');
const handler = require('./address-handlers');
const router  = express.Router();

module.exports =  () => {
    router
      .get("/", handler.initAddress)
      .get("/provinces", handler.getAllProvince)
      .get("/provinces/:provinceCode", handler.getProvinceByCode)
      .get("/districts/:provinceCode", handler.getDistrictsByProvince)
      .get("/wards/:districtCode", handler.getWardByDistrict)

      .get("/district/:districtCode", handler.getDistrictByDistrictCode)
      .get('/ward/:wardCode', handler.getWardByWardCode)

      .get("/province/:provinceId", handler.getProvinceById)
      .get("/district/:districtId", handler.getDistrictById)
      .get("/ward/:wardId", handler.getWardById);
    return router;
};


