import iteration1 from '../assets/about-images/iteration-1.jpg';
import milestone21 from '../assets/about-images/milestone-2-1.png'
import milestone22 from '../assets/about-images/milestone-2-2.png'
import nfp from '../assets/about-images/notts-for-profit.jpeg'
import signature from '../assets/about-images/signature.png'
import FigureCap from '../components/otherui/FigureCap';
import SmallerFigureCap from '../components/otherui/SmallerFigureCap';
import InlineCodeBlock from '../components/otherui/InlineCodeBlock';
import LargeCodeBlock from '../components/otherui/LargeCodeBlock';
import { CardOne, CardTwo } from '../components/otherui/CustomCard';

export default function About() {
    return (
        <div className="p-2 flex flex-col gap-3 mx-auto max-w-5xl">
            <div className="p-2">
                <h1 className="text-3xl font-bold mb-4">About</h1>
                <p>Dive into Drapt's history, from the beginning to where it currently stands.</p>
                <p>Quickly navigate to the section which interests you:</p>
                <nav className='text-sm text-primary space-y-1 pl-2  mt-1'>
                    <a href="#whatisdrapt" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">What is Drapt?</span>
                    </a>
                    <a href="#beginnings" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">An early vision</span>
                    </a>
                    <a href="#milestone1" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">Milestone #1</span>
                    </a>
                    <a href="#milestone2" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">Milestone #2</span>
                    </a>
                    <a href="#current" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">Where Drapt currently stands</span>
                    </a>
                    <a href="#acknowledgments" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">Acknowledgments</span>
                    </a>
                </nav>
            </div>
            <div className='divider my-1'></div>
            <CardOne id={"whatisdrapt"} title={"What is Drapt?"} badge={"Drapt"}>
                <p>Drapt is a modular portfolio analytics platform for portfolio risk and performance analysis - built for clarity, speed, and most importantly to educate.</p>
                <p>Empowering Portfolio Managers and Analysts alike, it demystifies quantitative portfolio analysis in an intuitive way, making it accessible for all levels of technical proficiency, from students who have never heard of Python to seasoned quants.</p>
                <p>Powered by high-performance servers and optimised computation pipelines, Drapt makes it easier than ever to understand a portfolio's current position amidst the inherent chaos of financial markets.</p>
                <LargeCodeBlock>
                    <p>def explain_drapt():</p>
                    <p>&nbsp;&nbsp;return "Modular, educational, and built for clarity."</p>
                </LargeCodeBlock>
            </CardOne>
            <div className='divider my-1'></div>
            <CardTwo id={"beginnings"} title={"Early vision..."} badge={"November, 2024"}>
                <p>Drapt began its story as DRAP-T, an acronym for <i>Dynamic Risk Analysis and Performance Tool</i>, in November 2024.</p>
                <p>The inspiration for starting the project was my desire to incorporate quantitative risk analytics into the NEFS Investment Fund, as around 1 month into being an analyst I realised that The Fund relied on qualitative risk analysis.</p>
                <p>Until the revamp, Drapt was being developed in a very inefficient manner, with the following tech stack:</p>
                <ul className='list-none pl-2 space-y-1 text-base'>
                    <li className="before:content-['-'] before:mr-2 before:text-white text-sm">
                        Python (backend)
                        <ul className="list-disc list-inside pl-4 text-sm mt-1 space-y-1">
                            <li>Flask - used for backend routing, deployed using a test server. Unconventional.</li>
                            <li>NumPy, Pandas, yfinance - quite typical for processing data.</li>
                            <li>Sqlite3 - hosted locally, not very modular as I had to create custom database managers in Python.</li>
                        </ul>
                    </li>
                    <li className='before:content-["-"] before:mr-2 before:text-white text-sm'>
                        HTML/CSS/JS (frontend)
                        <ul className='list-disc list-inside pl-4 text-sm mt-1 space-y-1'>
                            <li>HTML and CSS - manually written, literally from the ground up. No Tailwind CSS or DaisyUI like is being used today.</li>
                            <li>JS - base JS, including only one package: Chart.js</li>
                        </ul>
                    </li>
                </ul>
            </CardTwo>
             
            <CardOne id={"milestone1"} title={"Milestone #1"} badge={"End of November, 2024"}>
                <p>The first version of DRAP-T was not the prettiest, or the most functional...</p>
                <FigureCap srcfile={iteration1} alt={"First version of DRAP-T"}>
                    Figure 1: First functional DRAP-T prototype (Nov 2024)
                </FigureCap>
                <p>The first prototype did not allow for portfolio creation, and it only had three features:</p>
                <ul className='list-none pl-2 space-y-1 text-base'>
                    <li className="before:content-['-'] before:mr-2 before:text-gray-500 text-sm">A <i>very meaningless</i> returns histogram.</li>
                    <li className="before:content-['-'] before:mr-2 before:text-gray-500 text-sm">A cumulative portfolio returns plot, which was done incorrectly, using <InlineCodeBlock>cumsum()</InlineCodeBlock> instead of <InlineCodeBlock>cumprod()</InlineCodeBlock> - I'll admit, I didn't use log returns initially...</li>
                    <li className="before:content-['-'] before:mr-2 before:text-gray-500 text-sm">A (quite pointless) Monte Carlo simulation visualisation which 'forecasted' future portfolio returns, without taking into account asset correlations.</li>
                </ul>
                <p>But little did I know, this first prototype did in fact one day become something <b>magical</b>.</p>
                <LargeCodeBlock>
                    <p>def milestone_1():</p>
                    <p>&nbsp;&nbsp;fix_cumulative_returns = False</p>
                    <p>&nbsp;&nbsp;return "The prototype which started it all.."</p>
                </LargeCodeBlock>
            </CardOne>
             
            <CardTwo id={"milestone2"} title={"Milestone #2"} badge={"February, 2025"}>
                <p>This was the final version before the current revamp. It helped take my team in the WBSS Investment Challenge 2024/2025 to the finals, it really was something beautiful.</p>
                <p>Fixes were made, styles were changed, and the platform became a whole lot more functional. I mean, <i>I would hope so</i>, it took 3 months.</p>
                <p>Additionally, DRAP-T was renamed to <b>Drapt Analytics</b>, to reflect the clean interface and professional usability of the platform.</p>
                <p>From a high level, improvements and feature changes included:</p>
                <LargeCodeBlock>
                    <p>def milestone_two():</p>
                    <p>&nbsp;&nbsp;return "Refactor, restyle, and rethink risk"</p>
                </LargeCodeBlock>
                <ul className='list-none pl-2 space-y-1 text-white'>
                    <li className='before:content-["-"] before:mr-2 before:text-white text-sm'>Changed the style, from that odd green and gray to a more professional blue on white.</li>
                    <li className='before:content-["-"] before:mr-2 before:text-white text-sm'>Fixed cumulative returns (using log returns now instead of percentage returns).</li>
                    <li className='before:content-["-"] before:mr-2 before:text-white text-sm'>Added rolling volatility analysis (Figure 2), this really was a great feature.</li>
                    <li className='before:content-["-"] before:mr-2 before:text-white text-sm'>Improved the asset correlation matrix (Figure 3).</li>
                </ul>
                <p>And a few more features.</p>
                <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
                    <SmallerFigureCap srcfile={milestone21} alt={"Rolling Volatility chart screenshot from Milestone 2"}>
                        Figure 2: Rolling Volatility
                    </SmallerFigureCap>
                    <SmallerFigureCap srcfile={milestone22} alt={"Asset correlation matrix screenshot from Milestone 2"}>
                        Figure 3: Our hedges worked somewhat...
                    </SmallerFigureCap>
                </div>
                <p>To expand on my previous sentence mentioning the WBSS Investment Challenge, my team <b>Notts for Profit</b> managed to finish top 5 out of 80+ teams across the United Kingdom. We met some heavy competition, from brilliant teams from Warwick, UCL and Imperial, however as a team full of first-year undergraduates we really put Nottingham on the map.</p>
                <figure className='flex flex-col items-center my-2'>
                    <img
                        src={nfp}
                        alt="Team Notts for Profit representing NEFSIF at The Shard, February 2025"
                        className="aspect-video w-full sm:w-2/3 md:w-1/2 object-cover rounded"
                    />
                    <figcaption className='text-xs italic text-gray-200 mt-1 text-center'>
                        Team Notts for Profit, representing NEFSIF on the 17th floor of The Shard (Feb, 2025)
                    </figcaption>
                </figure>
            </CardTwo>
             
            <CardOne id={"current"} title={"Where it currently stands"} badge={"Present"}>
                <p>At the end of May 2025, I decided to revamp Drapt Analytics, rebuilding it using a modern React frontend (using TailwindCSS and DaisyUI), as well as upgrading the backend.</p>
                <p>As well as this, there was a (yet another) name change, with the platform now called <b>Drapt</b>.</p>
                <p>Drapt is still in motion, slowly accelerating, but it's already become something far greater than I imagined when I started. Thanks for reading - and welcome aboard.</p>
                <p>You may ask, what's next?</p>
                <ul className='list-none pl-2 space-y-1 text-base'>
                    <li className="before:content-['-'] before:mr-2 before:text-gray-500 text-sm">Month 1 → UI, along with dummy forms (such as login, etc.) - where I currently stand.</li>
                    <li className="before:content-['-'] before:mr-2 before:text-gray-500 text-sm">Month 2 → the start of work on the backend (FastAPI, webhooks, the lot).</li>
                    <li className="before:content-['-'] before:mr-2 before:text-gray-500 text-sm">Month 3 → optimisation, design refinements, and other work (setting up Redis, production DB's).</li>
                </ul>
                <p>Szymon Kopyciński</p>
            </CardOne>
             
            <CardTwo id={"acknowledgments"} title={"Acknowledgments"} badge={""}>
                <p>Drapt wouldn't be possible without the incredible open-source tools and resources that supported its development:</p>
                
                <ul className='list-none pl-2 space-y-1 text-white'>
                    <li className='before:content-["-"] before:mr-2 before:text-white text-sm'>React — the foundation of the frontend.</li>
                    <li className='before:content-["-"] before:mr-2 before:text-white text-sm'>Tailwind CSS & DaisyUI — for styling and UI speed.</li>
                    <li className='before:content-["-"] before:mr-2 before:text-white text-sm'>Python, Pandas, NumPy, FastAPI — for data wrangling, logic, and the rest of the backend.</li>
                    <li className='before:content-["-"] before:mr-2 before:text-white text-sm'>My mentors at NEFS, The Fund, and the WBSS challenge team — for believing in this vision early on.</li>
                    <li className='before:content-["-"] before:mr-2 before:text-white text-sm'>And finally, my parents, for their unconditional support throughout my studies.</li>
                </ul>
            </CardTwo>
        </div>
    );
}