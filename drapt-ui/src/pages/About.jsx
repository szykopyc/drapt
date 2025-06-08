import {FigureCap, SmallerFigureCap} from '../components/baseui/CustomFigures';
import LargeCodeBlock from '../components/baseui/LargeCodeBlock';
import { CardOne, CardTwo } from '../components/baseui/CustomCard';
import { BeginText } from '../components/baseui/BeginText';
import { MainBlock } from '../components/baseui/MainBlock'
import { CustomUL, CustomLI, CustomNestedUL } from '../components/baseui/CustomList';

export default function About() {
    return (
        <MainBlock>
            <BeginText title={"About"}>
                <p>Dive into Drapt's history, from the beginning to where it currently stands.</p>
                <p>Quickly navigate to the section which interests you:</p>
                <nav className='text-sm text-primary space-y-1 pl-2  mt-1'>
                    <a tabIndex={0} href="#whatisdrapt" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">What is Drapt?</span>
                    </a>
                    <a tabIndex={0} href="#beginnings" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">An early vision</span>
                    </a>
                    <a tabIndex={0} href="#milestone1" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">Milestone #1</span>
                    </a>
                    <a tabIndex={0} href="#milestone2" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">Milestone #2</span>
                    </a>
                    <a tabIndex={0} href="#current" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">Where Drapt currently stands</span>
                    </a>
                    <a tabIndex={0} href="#acknowledgments" className='block before:content-["-"] before:mr-2 text-info text-sm'>
                        <span className="hover:underline">Acknowledgments and Attributions</span>
                    </a>
                </nav>
            </BeginText>
            <div className='divider my-0'></div>
            <CardOne id={"whatisdrapt"} title={"What is Drapt?"} badge={"Drapt"}>
                <p>Drapt is a modular portfolio analytics platform for portfolio risk and performance analysis - built for clarity, speed, and most importantly to educate.</p>
                <p>Empowering Portfolio Managers and Analysts alike, it demystifies quantitative portfolio analysis in an intuitive way, making it accessible for all levels of technical proficiency, from students who have never heard of Python to seasoned quants.</p>
                <p>Powered by high-performance servers and optimised computation pipelines, Drapt makes it easier than ever to understand a portfolio's current position amidst the inherent chaos of financial markets.</p>
                <LargeCodeBlock>
                {`$ drapt init\n> Initialising...\n> Done! Welcome to Drapt.`}
                </LargeCodeBlock>
            </CardOne>
            <div className='divider my-0'></div>
            <CardTwo id={"beginnings"} title={"Early vision..."} badge={"November, 2024"}>
                <p>Drapt began its story as DRAP-T, an acronym for <i>Dynamic Risk Analysis and Performance Tool</i>, in November 2024.</p>
                <p>The inspiration for starting the project was my desire to incorporate quantitative risk analytics into the NEFS Investment Fund, as around 1 month into being an analyst I realised that The Fund relied on qualitative risk analysis.</p>
                <p>Until the revamp, Drapt was being developed in a very inefficient manner, with the following tech stack:</p>
                <CustomUL>
                    <CustomLI>
                        Python (backend)
                        <CustomNestedUL>
                            <li>Flask - used for backend routing, deployed using a test server. Unconventional.</li>
                            <li>NumPy, Pandas, yfinance - quite typical for processing data.</li>
                            <li>Sqlite3 - hosted locally, not very modular as I had to create custom database managers in Python.</li>
                        </CustomNestedUL>
                    </CustomLI>
                    <CustomLI>
                        HTML/CSS/JS (frontend)
                        <CustomNestedUL>
                            <li>HTML and CSS - manually written, literally from the ground up. No Tailwind CSS or DaisyUI like is being used today.</li>
                            <li>JS - base JS, including only one package: Chart.js</li>
                        </CustomNestedUL>
                    </CustomLI>
                </CustomUL>
            </CardTwo>
             
            <CardOne id={"milestone1"} title={"Milestone #1"} badge={"End of November, 2024"}>
                <p>The first version of DRAP-T was not the prettiest, or the most functional...</p>
                <FigureCap srcfile="/about-images/iteration-1.jpg" alt={"First version of DRAP-T"}>
                    Figure 1: First functional DRAP-T prototype (Nov 2024)
                </FigureCap>
                <p>The first prototype did not allow for portfolio creation, and it only had three features:</p>
                <CustomUL>
                    <CustomLI>A returns histogram with no additive value.</CustomLI>
                    <CustomLI>A cumulative returns chart, though I mistakenly used a simple sum of returns instead of compounding them - I hadn’t discovered log returns yet.</CustomLI>
                    <CustomLI>A low-utility Monte Carlo simulation visualisation which 'forecasted' future portfolio returns, without taking into account asset correlations.</CustomLI>
                </CustomUL>
                <LargeCodeBlock>
                    <p>def milestone_1():</p>
                    <p>&nbsp;&nbsp;fix_cumulative_returns = False</p>
                    <p>&nbsp;&nbsp;return "The prototype which started it all.."</p>
                </LargeCodeBlock>
            </CardOne>
             
            <CardTwo id={"milestone2"} title={"Milestone #2"} badge={"February, 2025"}>
                <p>This was the final version before the current revamp. It helped take my team in the WBSS Investment Challenge 2024/2025 to the finals, it was really quite fantastic.</p>
                <p>Fixes were made, styles were changed, and the platform became a whole lot more functional. I mean, <i>I would hope so</i>, it took 3 months.</p>
                <p>Additionally, DRAP-T was renamed to <b>Drapt Analytics</b>, to reflect the clean interface and professional usability of the platform.</p>
                <p>From a high level, improvements and feature changes included:</p>
                <CustomUL>
                    <CustomLI>Changed the style, from that odd green and gray to a more professional blue on white.</CustomLI>
                    <CustomLI>Fixed cumulative returns (using log returns now instead of percentage returns).</CustomLI>
                    <CustomLI>Added rolling volatility analysis (Figure 2), this really was a great feature.</CustomLI>
                    <CustomLI>Improved the asset correlation matrix (Figure 3).</CustomLI>
                </CustomUL>
                <p>And a few more features.</p>
                <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
                    <SmallerFigureCap srcfile="/about-images/milestone-2-1.png" alt={"Rolling Volatility chart screenshot from Milestone 2"}>
                        Figure 2: Rolling Volatility
                    </SmallerFigureCap>
                    <SmallerFigureCap srcfile="/about-images/milestone-2-2.png" alt={"Asset correlation matrix screenshot from Milestone 2"}>
                        Figure 3: Our hedges worked somewhat...
                    </SmallerFigureCap>
                </div>
                <p>To expand on my previous sentence mentioning the WBSS Investment Challenge, my team <b>Notts for Profit</b> managed to finish top 5 out of 80+ teams across the United Kingdom. We met some heavy competition, from brilliant teams from Warwick, UCL and Imperial, however as a team full of first-year undergraduates we really put Nottingham on the map.</p>
                <figure className='flex flex-col items-center my-2'>
                    <img
                        src="/about-images/notts-for-profit.jpeg"
                        alt="Team Notts for Profit representing NEFSIF at The Shard, February 2025"
                        className="aspect-video w-full sm:w-2/3 md:w-1/2 object-cover rounded"
                    />
                    <figcaption className='text-xs italic text-gray-200 mt-1 text-center'>
                        Team Notts for Profit, representing NEFSIF on the 17th floor of The Shard (Feb, 2025)
                    </figcaption>
                </figure>
                <LargeCodeBlock invert>
                    <p>def milestone_two():</p>
                    <p>&nbsp;&nbsp;return "Refactor, restyle, and rethink risk"</p>
                </LargeCodeBlock>
            </CardTwo>
             
            <CardOne id={"current"} title={"Where it currently stands"} badge={"Present"}>
                <p>At the end of May 2025, I decided to revamp Drapt Analytics, rebuilding it using a modern React frontend (using TailwindCSS and DaisyUI), as well as upgrading the backend.</p>
                <p>As well as this, there was a (yet another) name change, with the platform now called <span className='text-accent'>Drapt</span>.</p>
                <p>Drapt is still in motion, slowly accelerating, but it's already become something far greater than I imagined when I started. Thanks for reading - and welcome aboard.</p>
                <p>You may ask, what's next?</p>
                <CustomUL>
                    <li className="before:content-['-'] before:mr-2 text-sm text-info">
                        Month 1 → UI Completion + UX Polish
                        <CustomNestedUL>
                            <li>Refine visuals, motion and responsiveness.</li>
                            <li>Finalise component library (e.g., metrics, cards, layouts).</li>
                            <li>Add joy: empty states, tooltips, microcopy.</li>
                            <li>Wrap up with confidence.</li>
                        </CustomNestedUL>
                    </li>
                    <CustomLI>
                        Month 2 → Backend Build + API Design
                        <CustomNestedUL>
                            <li>FastAPI backend: user, auth, risk/return APIs.</li>
                            <li>Define clear schema: portfolios, metrics, time series.</li>
                            <li>Connect frontend to live/mock endpoints.</li>
                            <li>Handle auth logic and state management.</li>
                        </CustomNestedUL>
                    </CustomLI>
                    <CustomLI>
                        Month 3 → Infrastructure, Optimisation, Internal Deployment
                        <CustomNestedUL>
                            <li>Dockerise frontend + backend.</li>
                            <li>Deploy staging instance (Render/Fly.io).</li>
                            <li>Add basic analytics/logging.</li>
                            <li>Run Drapt internally at NEFS with dummy logins.</li>
                        </CustomNestedUL>
                    </CustomLI>
                    <CustomLI>
                        Month 4 → Documentation, Rollout, Expansion
                        <CustomNestedUL>
                            <li>Create onboarding flows + logic.</li>
                            <li>Finalise README, tech spaces, admin tools.</li>
                            <li>Prep outreach: PDF one-pager, demo videos, live microsite.</li>
                            <li>Integrate feedback, and do a "V1.0" cut.</li>
                        </CustomNestedUL>
                    </CustomLI>
                </CustomUL>
                <p><br />Szymon Kopyciński</p>
                <p>Founder and Lead Developer</p>
            </CardOne>
             
            <CardTwo id={"acknowledgments"} title={"Acknowledgments and Attributions"}>
                <p>Drapt wouldn't be possible without the incredible open-source tools, resources, and most importantly people that are supporting its development:</p>
                <CustomUL>
                    <CustomLI>React and Vite - the foundation of the frontend.</CustomLI>
                    <CustomLI>Tailwind CSS & DaisyUI - for styling and UI speed.</CustomLI>
                    <CustomLI>Python, Pandas, NumPy, statsmodels, FastAPI - for data wrangling, logic, and the rest of the backend.</CustomLI>
                    <CustomLI>The CEO of <a tabIndex={0} href="https://www.tiingo.com" target="_blank" rel="noopener noreferrer" className='underline'>Tiingo</a>, Rishi Singh, for providing Drapt with a commercial redistribution license free of charge.</CustomLI>
                    <CustomLI>My mentors at NEFS, The Fund, and the WBSS challenge team - for believing in this vision early on.</CustomLI>
                    <CustomLI>And last but not least, my family, for their unconditional support throughout my studies.</CustomLI>
                </CustomUL>
                <p>And I suppose a final thank you to you, user. For being the most important part of this journey. I hope Drapt serves you well.</p>
            </CardTwo>
        </MainBlock>
    );
}