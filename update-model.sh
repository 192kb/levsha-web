output_dir=`dirname $0`/src/model
echo "Generating model based on swagger specs to $output_dir" 
rm -rf $output_dir
openapi-generator generate \
  --input-spec swagger.yaml \
  --generator-name typescript-axios \
  --output $output_dir \
  --enable-post-process-file
