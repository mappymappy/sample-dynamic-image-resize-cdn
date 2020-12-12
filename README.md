# sample-dynamic-image-resize-cdn
 This is a sample image conversion CDN that uses AWS CloudFront and Lambda@Edge


# 説明
 CloudFrontとLambda@Edgeを利用して、sharpで画像を動的に変換して返すサンプルコードです。
 詳細な解説はこちらを参照ください。
 動作確認 Node 12.5.0

# 全体像

# パラメーター

以下のパラメーターを受け取って指定された変換を行います。

| parameterName | type | description |
|:---|:---:|---:|
|width |int |5~1024 |
|height |int |5~1024 |

# デプロイ

[Serverless Framework](https://serverless.com/)を利用した構成になっているので、
インストールします。

```
npm update
npm install -g serverless
npm install --save-dev --save-exact serverless-plugin-scripts
npm install --save-dev --save-exact serverless-plugin-cloudfront-lambda-edge
```

ご自身のAWSの認証情報を任意の方法でセットしてください。
以下は環境変数の場合の例です。

```
export AWS_ACCESS_KEY_ID=xxxxx
export AWS_SECRET_ACCESS_KEY=xxxxxx
export AWS_DEFAULT_REGION=ap-northeast-1
```

env_sample.yml内にdummyで記載されているBucket名やリソースを自身のアカウントの
物に書き換えた後は以下のコマンドでデプロイ可能です

```
sls deploy --stage sample
```

