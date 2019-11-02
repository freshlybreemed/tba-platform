import Head from 'next/head';
import AccountSettings from '../components/AccountSettings';

const AccountSettingsPage= () => {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="/static/react-vis.css" />  
            </Head>
            <AccountSettings />

        </>
    )
}

export default AccountSettingsPage