import ThemeSwitcher from '../components/userui/ThemeSwitcher'
import CurrencySwitcher from '../components/userui/CurrencySwitcher';
import { CardOne } from '../components/otherui/CustomCard';
import ProfileCard from '../components/userui/ProfileCard';
import ChangePassword from '../components/userui/ChangePassword';

export default function Profile() {
    return (
        <div className="p-2 flex flex-col gap-3 mx-auto max-w-5xl">
            <div className="p-2">
                <h1 className="text-3xl font-bold mb-4">Welcome, Szymon</h1>
                <p>View your profile and settings here.</p>
            </div>
            <div className='divider my-1'></div>
            <ProfileCard username="szymon" fullname="Szymon Kopyciński" email="szymon.kopycinski@outlook.com" role="Founder" team="Developers"></ProfileCard>
            <div className='divider my-1'></div>
            <CardOne id={"profile"} title={"Preferences"} badge={"Preferences"}>
                <div className='flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between items-start md:items-center'>
                    <h2 className='text-lg'>Select colour scheme</h2>
                    <ThemeSwitcher />
                </div>
                <div className='flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between items-start md:items-center'>
                    <h2 className='text-lg'>Select Currency</h2>
                    <CurrencySwitcher />
                </div>
            </CardOne>
            <div className='divider my-1'></div>
            <ChangePassword></ChangePassword>
        </div>
    );
}