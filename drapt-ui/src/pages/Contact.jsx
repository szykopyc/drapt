import { FaLinkedin, FaEnvelope, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { CardOne, SplitCardBody, ContactProfileCardElement } from '../components/baseui/CustomCard';
import { MainBlock } from '../components/baseui/MainBlock';
import { BeginText } from '../components/baseui/BeginText';
import { useState } from 'react';
import FullscreenItem from '../components/helperui/FullscreenItemHelper';

export default function Contact() {
  const [fullScreenItem, setFullScreenItem] = useState("");

  return (
    <MainBlock>
      <BeginText title={"Contact"}>
        <p>Feel free to get in touch with the NEFS Investment Fund, or Szymon.</p>
      </BeginText>
      <div className='divider my-0'></div>
      <CardOne id="nefsif-contact" title="Contact NEFSIF" badge="Fund">
        <SplitCardBody>
          <img
            src="/contact-images/nefsif-pfp.jpg"
            alt="NEFSIF profile picture"
            className="w-full aspect-square md:w-1/2 aspect-square md:aspect-square md:h-auto object-cover rounded"
            loading='lazy'
          />
          <ContactProfileCardElement name={"NEFS Investment Fund"}
            introText={"Contact the Fund for all enquiries. The team will normally answer within business hours, Monday to Friday, 09:00 until 17:00."}>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-info text-lg min-w-[24px]" />
              <a tabIndex={0} href="mailto:nefsinvestmentfund@gmail.com" className="hover:underline text-info">nefsinvestmentfund@gmail.com</a>
            </div>
            <div className="flex items-center gap-2">
              <FaInstagram className="text-info text-lg min-w-[24px]" />
              <a tabIndex={0} href="https://www.instagram.com/nefsif/" target="_blank" rel="noopener noreferrer" className="hover:underline text-info">
                www.instagram.com/nefsif/
              </a>
            </div>
          </ContactProfileCardElement>
        </SplitCardBody>
      </CardOne>
      <CardOne id="szymon-contact" title="Contact Szymon" badge="Direct">
        <SplitCardBody>
          <img
            src="/contact-images/szymon-pfp.jpg"
            alt="Szymon profile picture"
            className="w-full aspect-square md:w-1/2 aspect-square md:aspect-square md:h-auto object-cover rounded"
            loading='lazy'
          />
          <ContactProfileCardElement name={"Szymon Kopyciński"}
            optionalRole={"Founder and Developer, Head of Systems and Publications"}
            introText={"Contact me for both technical and fund enquiries. I will respond to messages where possible."}>
            <div className="flex items-center gap-2">
              <FaWhatsapp className="text-info text-lg min-w-[24px]" />
              <a tabIndex={0} href="https://wa.me/447308511995" className="hover:underline text-info">+44 7308 511995</a>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-info text-lg min-w-[24px]" />
              <a tabIndex={0} href="mailto:szymon.kopycinski@outlook.com" className="hover:underline text-info">szymon.kopycinski@outlook.com</a>
            </div>
            <div className="flex items-center gap-2">
              <FaLinkedin className="text-info text-lg min-w-[24px]" />
              <a tabIndex={0} href="https://linkedin.com/in/szymonkopycinski" target="_blank" rel="noopener noreferrer" className="hover:underline text-info">
                linkedin.com/in/szymonkopycinski
              </a>
            </div>
          </ContactProfileCardElement>
        </SplitCardBody>
      </CardOne>
    </MainBlock>
  );
}
