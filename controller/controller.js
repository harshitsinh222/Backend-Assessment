const axios = require('axios');

const myStatus = (req, res) => {
  res.status(200).send({
    success: 'true',
  })
}

const retrieveTags = (req, res) => {

  const { tags, sortBy, direction } = req.params;
  const correctDirections = ['asc', 'desc', undefined];
  const correctSort = ['id', 'author', 'authorId', 'likes', 'popularity', 'reads', 'tags', undefined];

  //It will throw an eror for invalid directions and invalid sorts
  if (correctDirections.indexOf(direction) === -1) {
    res.status(400).send({
      error: 'sortBy Direction is wrong',
    });
  }

  if (correctSort.indexOf(sortBy) === - 1) {
    res.status(400).send({
      error: 'sortBy parameter is wrong',
    });
  }

  // If user requests more than one tag
  if (tags.indexOf(',') !== - 1) {
    let newTagArray = tags.split(',');
    let newPaths = newTagArray.map((tag, i) => {
      return axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
    });


    // So here it will call all the matching api with arguements passed by the help of axios.all
    axios.all([
      ...newPaths
    ])

    // There are 0 possibilities for the tag
      .then(axios.spread((tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9) => {
        let myData = [
          tag1 ? tag1.data.posts : '',  // empty for null string
          tag2 ? tag2.data.posts : '',
          tag3 ? tag3.data.posts : '',
          tag4 ? tag4.data.posts : '',
          tag5 ? tag5.data.posts : '',
          tag6 ? tag6.data.posts : '',
          tag7 ? tag7.data.posts : '',
          tag8 ? tag8.data.posts : '',
          tag9 ? tag9.data.posts : ''
        ]

        //Removing duplicate data using Hash Table
        let finalData = {};
        let finalDatas = [];
        for (let i = 0; i < myData.length; i++) {
          let allData = myData[i];
          for (let j = 0; j < allData.length; j++) {
            finalData[allData[j].id] = allData[j];
          }
        }
        //Making the response in correct form
        for (let values in finalData) {
          finalDatas.push(finalData[values]);
        }
        
        //Sorting the response
        if (sortBy) {
          if (direction === 'asc') {
            finalDatas = finalDatas.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
          
          } else {
            finalDatas = finalDatas.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
          }
        }

        res.status(200).send(finalDatas);
      }))
      // If no tags are used, then this error will be shown to the user
      .catch(error => {
        res.status(400).send({
          error: 'Tags are missing',
        })
        console.log(error)
      });
  } else {
    // If the user only searches for only one tag
    axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`)
      .then(request => {
        let mydata = request.data.posts;
        if (sortBy) {
          if (direction === 'asc') {
            mydata = mydata.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
         
          } else {
            mydata = mydata.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
          }
        }
        res.status(200).send(mydata);
      })
      .catch(error => {
        res.status(400).send({
          error: 'Tags parameter is required',
        })
        console.log(error)
      });
  }
}

module.exports = {
  myStatus,
  retrieveTags
}