import React, { Component } from "react";
import AWS from "aws-sdk";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// S3_ACCESS_KEY=AKIAWCYMVJKXRBVYWUFJ
// S3_SECRET_KEY=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

const s3 = new AWS.S3({
  accessKeyId: "AKIAWCYMVJKXRBVYWUFJ",
  secretAccessKey: "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",
  region: "ap-southeast-2"
});

class ImageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: []
    };
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  render() {
    return (
      <div className="App">
        {/* Pass FilePond properties as attributes */}
        <FilePond
          ref={ref => (this.pond = ref)}
          files={this.state.files}
          allowMultiple={true}
          maxFiles={3}
          server={{
            url: "http://localhost:3000/images",
            process: function(
              fieldName,
              file,
              metadata,
              load,
              error,
              progress,
              abort
            ) {
              s3.upload(
                {
                  Bucket: "bronte-portfolio",
                  Key: Date.now() + "_" + file.name,
                  Body: file,
                  ContentType: file.type,
                  ACL: "public-read"
                },
                function(err, data) {
                  if (err) {
                    error("Something went wrong");
                    return;
                  }
                  console.log(data);
                  // pass file unique id back to filepond
                  load(data.Key);
                }
              );
            }
          }}
          oninit={() => this.handleInit()}
          onupdatefiles={fileItems => {
            // Set current file objects to this.state
            this.setState({
              files: fileItems.map(fileItem => fileItem.file)
            });
          }}
        ></FilePond>
      </div>
    );
  }
}

export default ImageForm;
