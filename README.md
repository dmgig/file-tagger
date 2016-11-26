FILE TAGGING w/ VOICE RECOGNITION

In Progress.

NodeJS, MongoDB.

Only tested in Chrome.

<pre>
+--------------+------+------+
|              | File | tags |
|  FILE DISP   | List +------+
|  DIR DISP    |      |notes |
|              |      |      |
+--------------+------+------+
</pre>

![In Progress](sample.png?raw=true "In Progress")


up + down keys, file selector

right key: ready new tag

left key: delete last tag

```
{ 
  fileid:
  filepath:
  file_md5:
  tags:
}
```
```
{
  noteid:
  fileid:
  fileposition:
  note:
}
```

REST
----

GET    /api/files

POST   /api/files

GET    /api/files/:id

PUT    /api/files/:id

DELETE /api/files/:id

From: 
https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

Known Bugs
==========

Tags sometimes will not save on a new item
PDF display can go away
