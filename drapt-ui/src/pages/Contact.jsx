import szymonpfp from '../assets/contact-images/szymon-pfp.jpeg';
import { FaLinkedin, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { CardOne, SplitCardBody } from '../components/baseui/CustomCard';
import { MainBlock } from '../components/baseui/MainBlock';
import { BeginText } from '../components/baseui/BeginText';;

export default function Contact() {
    return (
        <MainBlock>
            <BeginText title={"Contact"}>
                <p>Feel free to get in touch with Szymon, or the NEFS Investment Fund Executive Team.</p>
            </BeginText>
            <div className='divider my-0'></div>
            <CardOne id="szymon-contact" title="Contact Szymon" badge="Direct">
                <SplitCardBody>
                    <img
                        src={szymonpfp}
                        alt="Szymon profile picture"
                        className="w-full md:w-1/2 h-128 object-cover object-[10%_20%] rounded"
                        loading='lazy'
                    />
                    <div className='sm:w-max md:w-1/2'>
                        <h2 className='text-xl font-bold'>Szymon Kopyciński</h2>
                        <p>Contact me for both technical and fund inquiries.</p>
                        <div className="space-y-2 mt-2 text-base-content">
                            <div className="flex items-center gap-2">
                                <FaWhatsapp className="text-primary text-lg min-w-[24px]" />
                                <a tabIndex={0} href="whatsapp:+44 7308 511995" className="hover:underline">+44 7308 511995</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaEnvelope className="text-primary text-lg min-w-[24px]" />
                                <a tabIndex={0} href="mailto:szymon.kopycinski@outlook.com" className="hover:underline">szymon.kopycinski@outlook.com</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaLinkedin className="text-primary text-lg min-w-[24px]" />
                                <a tabIndex={0} href="https://linkedin.com/in/szymonkopycinski" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    linkedin.com/in/szymonkopycinski
                                </a>
                            </div>
                        </div>
                    </div>
                </SplitCardBody>
            </CardOne>
            <CardOne id="nefsif-contact" title="Contact NEFS Investment Fund" badge="Fund">
                <SplitCardBody>
                    {/* Insert NEFSIF contact details here.*/}
                </SplitCardBody>
            </CardOne>
        </MainBlock>
    );
}