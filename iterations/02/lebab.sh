# safe
lebab --replace index.js --transform arrow
lebab --replace index.js --transform for-of
lebab --replace index.js --transform for-each
lebab --replace index.js --transform arg-rest
lebab --replace index.js --transform arg-spread
lebab --replace index.js --transform obj-method
lebab --replace index.js --transform obj-shorthand
lebab --replace index.js --transform multi-var
# unsafe
lebab --replace index.js --transform let
lebab --replace index.js --transform template
