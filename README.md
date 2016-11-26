FILE TAGGING w/ VOICE RECOGNITION

From: 
https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

<pre>
+--------------+------+------+
|              | File | tags |
|  FILE DISP   | List +------+
|  DIR DISP    |      |notes |
|              |      |      |
+--------------+------+------+
</pre>

up + down keys, file selector

right key: ready new tag
left key: delete last tag

fileid:
filepath:
file_md5:
filetags:

noteid:
fileid:
fileposition:
note:

REST
----

GET    /api/files
POST   /api/files
GET    /api/files/:id
PUT    /api/files/:id
DELETE /api/files/:id
