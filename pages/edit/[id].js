import Create from '../../components/Create';
import Head from 'next/head';
import { connect } from 'react-redux';

const CreatePage = () => {
    return (
        <>
          <Head>
            <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"/>
            <link href="//cdnjs.cloudflare.com/ajax/libs/antd/3.23.4/antd.css" rel="stylesheet"/>
          </Head>
          <Create />
        </>
      );
}


export default connect()(CreatePage)