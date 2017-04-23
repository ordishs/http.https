# httpx
Serve HTTP and HTTPS on the same port.

Installation
------------

```npm install --save http.https```

or

```yarn add http.https```

Usage
-----

See examples folder.  Please note that you will need an SSL certificate to run these examples.  A temporary, self-signed certificate can be generated as follows:
```
cd examples

openssl genrsa -out example.key 2048
openssl req -new -out example.csr -key example.key
openssl x509 -req -in example.csr -signkey example.key -out example.crt

```

The example depends on Express and SocketIO.  These can be installed as follows:

```
cd examples

npm install
npm start

```

When the server is running, you can test by going to [http://localhost:3000](http://localhost:3000) or [https://localhost:3000](https://localhost:3000) in your browser.
