# jeffws-templates

## Demo

1. Generate a stack `./bin/generate-stack`
2. Deploy it `npm run deploy:stack`
3. Deploy code `npm run deploy:code`
4. Generate a function & api method
	* `./bin/generate-function Person index`
	* `./bin/generate-api-collection-method Person get index`
5. Deploy it `npm run deploy:stack`

## TODO

Deployment pipeline:

- Package the code into a zip file => ./package/jeffws-service.zip
- Upload zip file to s3 bucket if md5 is different
- Add S3ObjectVersion to Lambda Function code blocks
- Deploy stack
