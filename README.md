REASEARCHER 1.0: File Tagging with Voice Recognition
===================================================

Requires: NodeJS, MongoDB. Tested in Chrome.

Features: Webkit Speech Recognition

![In Progress](sample.png?raw=true "In Progress")

keys:

*up + down* file selector

*right (hold)* start new tag, voice recognition

*right (up)*   stop voice recognition

*left key* delete last tag

```
{ 
  file: ''    // string, file name
  path: ''    // string, full file path
  md5:  ''    // string, md5 hash of file
  updated: '' // datetime
  added:   '' // datetime
  tags: ''    // array, file tags
}
```
```
/* @todo */
{
  noteid: ''
  fileid: ''
  fileposition: ''
  note: ''
}
```

REST
----
```
GET    /api/files
POST   /api/files
GET    /api/files/:id
PUT    /api/files/:id
DELETE /api/files/:id

GET    /api/files/path/:filepath
GET    /api/files/search/:searchterm
```

From: 
https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
