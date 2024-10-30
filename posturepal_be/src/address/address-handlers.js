const fs = require('fs');
const Province = require('./vietname-db.js/province-model'); 
const District = require('./vietname-db.js/district-model');
const Ward = require('./vietname-db.js/ward-model');


exports.initAddress = async (req, res, next) => {
    const addressFilePath =
        "/Users/user/Documents/posturepal_be/src/address/vietname-db.js/crawl_data/mongo_data_vn_unit.json";
    
    const data = fs.readFileSync(addressFilePath);
    console.log(data);
    
    const addressData = JSON.parse(data);
    try{
        for (let provinceData of addressData) {
            // Service Address
            let province = await Province.create({
                Type: provinceData.Type,
                Code: provinceData.Code,
                Name: provinceData.Name,
                NameEn: provinceData.NameEn,
                FullName: provinceData.FullName,
                FullNameEn: provinceData.FullNameEn,
                CodeName: provinceData.CodeName,
                AdministrativeUnitId: provinceData.AdministrativeUnitId,
                AdministrativeRegionId: provinceData.AdministrativeRegionId
            });
            console.log(`Created province: ${province.Name}`);
            for (let districtData of provinceData.District) {
                districtData.ProvinceCode = province.Code; 
                let district = await District.create({
                    Type: districtData.Type,
                    Code: districtData.Code,
                    Name: districtData.Name,
                    NameEn: districtData.NameEn,
                    FullName: districtData.FullName,
                    FullNameEn: districtData.FullNameEn,
                    CodeName: districtData.CodeName,
                    ProvinceCode: districtData.ProvinceCode,
                    AdministrativeUnitId: districtData.AdministrativeUnitId
                });
                console.log(`Created district: ${district.Name} (${district.ProvinceCode})`);

                for (let wardData of districtData.Ward) {
                    wardData.DistrictCode = district.Code; 
                    let ward = await Ward.create({
                        Type: wardData.Type,
                        Code: wardData.Code,
                        Name: wardData.Name,
                        NameEn: wardData.NameEn,
                        FullName: wardData.FullName,
                        FullNameEn: wardData.FullNameEn,
                        CodeName: wardData.CodeName,
                        DistrictCode: wardData.DistrictCode,
                        AdministrativeUnitId: wardData.AdministrativeUnitId
                    });
                    console.log(`Created ward: ${ward.Name} (${ward.DistrictCode})`);
                }
            }
        }
        res.status(200).json({
            data: "Create Success Provinces, Districts, Wards"
        })
    }catch(err){
        console.error('Error Init Address', err);
        res.status(500).json({
            err: err.errorResponse.errmsg
        })
    }
}

exports.getAllProvince = async (req, res, next) => {
    try {
        const provinces = await Province.find()
        res.status(200).json(provinces);
    } catch (err) {
        console.error('Error fetching provinces:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProvinceByCode = async (req, res, next) => {
    const provinceCode = req.params.provinceCode
    try {
        const provinces = await Province.findOne({Code: provinceCode})
        res.status(200).json(provinces);
    } catch (err) {
        console.error('Error fetching provinces:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getDistrictsByProvince = async (req, res, next) => {
    const provinceCode = req.params.provinceCode;
    try {
        let districts = await District.find({ProvinceCode: provinceCode})
        res.status(200).json({
            districts: districts
        })
    }catch(err){
        res.status(401).json({
            error: err,
            districts: "Can't not find any District contraint your Province code !"
        })
    }
}

exports.getWardByDistrict = async (req, res, next) => {
    const districtCode = req.params.districtCode;
    try {
        let wards = await Ward.find({DistrictCode: districtCode})
        res.status(200).json({
            wards: wards
        })
    }catch(err){
        res.status(401).json({
            error: err,
            distrwardsicts: "Can't not find any ward contraint your District code !"
        })
    }
}

exports.getDistrictByDistrictCode = async (req, res, next) => {
  const districtCode = req.params.districtCode;
  try {
    const district = await District.findOne({ Code: districtCode });
    if (!district) {
      return res.status(404).json({ error: "District not found" });
    }
    res.status(200).json(district);
  } catch (err) {
    console.error("Error fetching district:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getWardByWardCode = async (req, res, next) => {
  const wardCode = req.params.wardCode;
  try {
    const ward = await Ward.findOne({ Code: wardCode });
    if (!ward) {
      return res.status(404).json({ error: "Ward not found" });
    }
    res.status(200).json(ward);
  } catch (err) {
    console.error("Error fetching ward:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProvinceById = async (req, res, next) => {
  const provinceId = req.params.provinceId;
  try {
    const province = await Province.findById(provinceId);
    if (!province) {
      return res.status(404).json({ error: "Province not found" });
    }
    res.status(200).json(province);
  } catch (err) {
    console.error("Error fetching province:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDistrictById = async (req, res, next) => {
  const districtId = req.params.districtId;
  try {
    const district = await District.findById(districtId);
    if (!district) {
      return res.status(404).json({ error: "District not found" });
    }
    res.status(200).json(district);
  } catch (err) {
    console.error("Error fetching district:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getWardById = async (req, res, next) => {
  const wardId = req.params.wardId;
  try {
    const ward = await Ward.findById(wardId);
    if (!ward) {
      return res.status(404).json({ error: "Ward not found" });
    }
    res.status(200).json(ward);
  } catch (err) {
    console.error("Error fetching ward:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
