import { Upload, Icon, message } from 'antd';

// import ImgCrop from "antd-img-crop";
// import "antd/dist/antd.css";

import axios from 'axios'

class Avatar extends React.Component {
  state = {
    loading: false
  };

   getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
   processUpload = async (e) =>{
    this.setState({uploading: true})

    const formData = new FormData()
    formData.append("file", e)
    formData.append("upload_preset", "wfrfnmis")
  
    await axios(`https://api.cloudinary.com/v1_1/dzsf703vh/image/upload`, {
      method: 'POST',
      data: formData,
    })
    .then(res => {
      this.props.saveImage(res.data.secure_url)
  
      return res.data.secure_url
    })
    .catch(err =>{
      this.setState({uploading: false})
    })
  }
  
   beforeUpload(file) {
    const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJPGorPNG) {
      message.error('You can only upload JPG or PNG file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
    return isJPGorPNG && isLt5M;
  }
  handleChange = ({ onSuccess, onError, file }) => {
    console.log("info",file)
    // if (info.file.status === 'uploading') {
    //   this.setState({ loading: true });
    //   console.log("uploading")
    //   return;
    // }
    // if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.processUpload(file)
      .then(() => {
        onSuccess(null, file);
      })
      .catch(() => {
        // call onError();
        onError(null, file);
      });
      
    // }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const {image } = this.props;
    console.log(this.props)
    return (
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          customRequest={this.handleChange}
        >
          {image ? <img src={image} alt="avatar" /> : uploadButton}
        </Upload>
    );
  }
}

export default Avatar;
