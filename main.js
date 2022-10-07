const lookup = require("coordinate_to_country");
const fs = require("fs");
const { parse } = require("csv-parse");

const data = []
const error = []
const dataZoho = []
const errorZoho = []
  async function main(){
    fs.createReadStream("./geoInfos.csv")
    .pipe(
        parse({
          delimiter: ",",
          columns: true,
          ltrim: true,
        })
      )
      .on("data", function (row) {
        data.push(row);
      })
      .on("error", function (error) {
        console.log(error.message);
      })
      .on("end", function () {
        fs.createReadStream("./InfosZoho3.csv")
        .pipe(
            parse({
              delimiter: ",",
              columns: true,
              ltrim: true,
            })
          )
          .on("data", function (row) {
            dataZoho.push(row);
          })
          .on("error", function (errorZoho) {
            console.log(errorZoho.message);
          })
          .on("end", function () {
        //    let array = dataZoho.map(ligne=>{
        //     return ligne?.ID
        //     })
        //    fs.writeFileSync('arrayid',JSON.stringify(array))
           let dataToPush = data.filter((el,index)=>{
            const elementFind = dataZoho.find(elZoho => elZoho?.ID === el.planityid)
            console.log(((index++ / data.length) * 100).toFixed(2),'%')
            if(elementFind){
                return el                
            }
           })
           fs.writeFileSync('bizWithCountry3',JSON.stringify(dataToPush))
          })    


      });
    
  }


// main()

// dataTOPush
  const goodDatas = []
  async function testLength(){
    console.log('before without country')
    const bizWithoutCountry1 = require('./bizWithoutCountry1.json')
    console.log(bizWithoutCountry1.length)
    console.log('after with country')
    const bizWithCountry1 = require('./businessesWithCountry1.json')
    console.log(bizWithCountry1.length)
    console.log('-----')
    console.log('before without country')
    const bizWithoutCountry2 = require('./bizWithoutCountry2.json')
    console.log(bizWithoutCountry2.length)
    console.log('after with country')
    const bizWithCountry2 = require('./businessesWithCountry2.json')
    console.log(bizWithCountry2.length)
    console.log('-----')
    const bizWithoutCountry3 = require('./bizWithoutCountry3.json')
    console.log(bizWithoutCountry3.length)
  }
  // testLength()





  async function getCountries(){
    let bizWithoutCountry3 = require('./bizWithoutCountry3.json')
        let pointer = 0
      for(let business of bizWithoutCountry3){
        console.log(((pointer++ / bizWithoutCountry3.length) * 100).toFixed(2),'%')
        if(business?.longitude && business?.latitude){
            const country = lookup(business?.latitude, business?.longitude,true)
            business.country = country
        }else{
            error.push()
        }
      }
      fs.writeFileSync('businessesWithCountry3.json',JSON.stringify(bizWithoutCountry3))
    console.log(bizWithoutCountry3.length)
  }
  // getCountries()




  async function isolateWithoutCoordonates(){
    let noCoordonates = []
    let all = require('./all.json')
    let bizToUpload = []
    let noCountry = []
    let pointer = 0
    for(let business of all){
      console.log(((pointer++ / all.length) * 100).toFixed(2),'%')
      if(business?.country?.length === 0){
        noCountry.push(business)
      } else if(!business.longitude || !business.latitude){
        noCoordonates.push(business)
      }else{
        bizToUpload.push(business)
      }
    }
    fs.writeFileSync('allWithCoordonates.json',JSON.stringify(bizToUpload))
    fs.writeFileSync('allNoCoordonates.json',JSON.stringify(noCoordonates))
    fs.writeFileSync('allNoCountryFind.json',JSON.stringify(noCountry))
  console.log(noCountry.length)
  console.log(bizToUpload.length)
  console.log(noCoordonates.length)
  }
// isolateWithoutCoordonates()

  async function getOneFileAll(){
    let all1 = require('./beforeFilteredBusinesses/businessesWithCountry1.json')
    let all2 = require('./beforeFilteredBusinesses/businessesWithCountry2.json')
    let all3 = require('./beforeFilteredBusinesses/businessesWithCountry3.json')
    fs.writeFileSync('all.json',JSON.stringify([...all1,...all2,...all3]))
  }
//  getOneFileAll()

  async function getOneFileWithNoCoordonates(){
    let noCoordonates1 = require('./businessesNoCoordonates1.json')
    let noCoordonates2 = require('./businessesNoCoordonates2.json')
    let noCoordonates3 = require('./businessesNoCoordonates3.json')
    fs.writeFileSync('businessesNoCoordonates.json',JSON.stringify([...noCoordonates1,...noCoordonates2,...noCoordonates3]))
  }
  // getOneFileWithNoCoordonates()


  async function getOneFileWithCoordonates(){
    let coordonates1 = require('./businessesWithCoordonate1.json')
    let coordonates2 = require('./businessesWithCoordonate2.json')
    let coordonates3 = require('./businessesWithCoordonate3.json')
    fs.writeFileSync('businessesWithCoordonates.json',JSON.stringify([...coordonates1,...coordonates2,...coordonates3]))
  }
  // getOneFileWithCoordonates()



  async function filterByCountry(){
    byCountry = {}
    let withCoordonatesAndCountry = require('./allWithCoordonates.json')
    let pointer = 0
    for(let business of withCoordonatesAndCountry){
      console.log(((pointer++ / withCoordonatesAndCountry.length) * 100).toFixed(2),'%')
      if(business?.country?.length == 1){
        if(byCountry?.[`${business.country[0]}`]){
          byCountry[`${business.country[0]}`] = [...byCountry[business.country[0]],business]
        }else{
          byCountry[`${business.country[0]}`] =[business]
        }
      } else if(business?.country?.length == 2){
        if(byCountry?.[`${business.country[0]}_${business.country[1]}`]){
          byCountry[`${business.country[0]}_${business.country[1]}`] = [...byCountry[`${business.country[0]}_${business.country[1]}`],business]
        }else{
          byCountry[`${business.country[0]}_${business.country[1]}`] = [business]
        }
      }
    }
    for(let key of Object.keys(byCountry)){
      fs.writeFileSync(`${key}.json`,JSON.stringify(byCountry[key]))

    }
  }
  // filterByCountry()