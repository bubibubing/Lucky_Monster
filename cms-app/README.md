# CMS Frontend

Crisis Management System Frontend

## Getting Started

1. To create the image go to the root directory and execute
```
docker build -t cms-frontend .
```

2. To run the container from created image
```
docker run -it \
  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -p 3000:3000 \
  --rm \
  cms-frontend
```

3. Frontend can be accessed through the following link
```
http://localhost:3000/
```


