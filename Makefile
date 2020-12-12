prepare-sls:
	npm update
	npm install -g serverless
	npm install --save-dev --save-exact serverless-plugin-scripts
	npm install --save-dev --save-exact serverless-plugin-cloudfront-lambda-edge
