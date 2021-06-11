const fs = require('fs');
const prompt = require('prompt');

prompt.start();

class OfficeMgmtApp {

  init = async () => {
    console.log(`\n 1.Get all Employee. \n 2.Add an Employee. \n 3.Delete an Employee. \n 4.Do you want to Exit. \n `);

    console.log('\n Please enter the index no of operation to perform: ');  
  const {input} = await prompt.get(['input']);
    const key = parseInt(input);
    switch (key) {
      case 1:
        this.readAllEntries();
        break;
      case 2:
        this.addEntry();
        break;
      case 3:
        this.deleteEntry();
        break;
      case 4:
        process.exit(0);
        break;
 
      default:
        console.log('Please enter a valid input');
        this.init();
        break;
    }
      

}

  // Draw asterisk line 
  drawAsteriskLine = () => {
    console.log(`*********************************************************************************`);
  }

  // Draw dashed line 
  drawDashedLine = () => {
    console.log(`------------------------------------------------------------------------------`);
  }


// JSON READ All entries
   readAllEntries = () => {
  fs.readFile('employee.json','utf8',(err,data) => {
    if(err) { 
      console.log(new Error('Somthing went wrong !')); 
    } else {
      const recData = JSON.parse(data);
      this.drawAsteriskLine();
      recData.forEach((employee , i) => {
        for (const key in employee) {
          console.log(`${key} : ${employee[key]}` );
        }
        this.drawDashedLine();
      });
      this.init();

    }
  });

}


// JSON READ Single entry
  readEntry = (id) => {
  fs.readFile('employee.json','utf8',(err,data) => {
    if(err) { 
      console.log(new Error('Somthing went wrong !')); 
    } else {
      const recData = JSON.parse(data);
      let reqData;
      recData.forEach((post, i) => {
        if(post.id==id) {
          reqData = post;
        }

      });

        for (const key in reqData) {
          console.log(`${key} : ${reqData[key]}` );
        }
        console.log(`\n`);
        this.init();
  

    }
  });

}

// store data to JSON file
storeToJSON = data => {
       // Add updated data to json file
       fs.writeFile('employee.json',JSON.stringify(data,null,2),(err) => {
        if(err) {
          console.log(new Error('Some error happended while writing!'));
        } else {
          this.drawDashedLine();
          console.log('JSON File Updated !!! ');
        }
        this.init();
      } );
} 


// Create new json object and add it to json file CREATE

   addEntry = () => {
  fs.readFile('employee.json','utf8',(err,data) => {
    if(err) { 
      console.log(new Error('Somthing went wrong !')); 
    } else {
      const recData = JSON.parse(data);
      let lastElementId = recData[recData.length-1].id
      let newId = lastElementId +1;
      this.drawAsteriskLine();
      console.log(' Please enter the following fields : ');
      this.drawAsteriskLine();

      // inputs for the employee
      var schema = {
        properties: {
          name: {
            pattern: /^[a-zA-Z\s\-]+$/,
            message: 'Name must be only letters, spaces, or dashes',
            required: true
          },
          email: {
            pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: 'Enter a valid Email id',
            required: true
          }
        }
      };
      prompt.get(schema, (err, result) => {
        if (err) {
            throw err;
        }
        const name =  result.name;
        const email =  result.email;

        // Add new data to the JSON object
        recData.push({  "id": newId,  "name": name,  "email": email });
        this.storeToJSON(recData);
      });
    
  
  }
  });
}

// Delete from entries
   deleteEntry = async () => {
     this.drawAsteriskLine();
  console.log('Please enter the Name of entry to Delete: ');
  let {name} = await prompt.get(['name']);

  
  fs.readFile('employee.json','utf8',(err, data) => {
    if (err) {
      throw err;
    }

    this.drawDashedLine();
      console.log(`\n To confirm the deletion press y `);
      prompt.get(['action'], (err, result) => {
        if (err) {
            throw err;
        }

        let recData = JSON.parse(data);
        if (result.action.toLowerCase()=='y'||result.action.toLowerCase()=='yes') {
          recData.forEach((employee, i) => {
            let deleteEmpName =employee.name;
            if (deleteEmpName.toLowerCase() == name.toLowerCase()) {
                recData.splice(i, 1);

            }
        });
        this.storeToJSON(recData);
        } else if(result.action.toLowerCase()=='n'||result.action.toLowerCase()=='no') {
          this.init();
        }
        
      });
  });

}
}

// Class object created
let officeMgmtObj = new OfficeMgmtApp();
officeMgmtObj.init();

