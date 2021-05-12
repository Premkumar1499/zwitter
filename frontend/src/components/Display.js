import React, { useEffect, useState } from 'react'
import BigModal from '../common/BigModal'
import { CloseIcon } from '../common/Icon'
import { themeColor } from '../common/themeColor'


function Display({ handleClose }) {
    const [color, setColor] = useState(localStorage.getItem('color') || '0')
    const [theme, setTheme] = useState(localStorage.getItem('theme') || '0')

    useEffect(() => {
        localStorage.setItem("theme", theme)
        localStorage.setItem("color", color)
        themeColor(color, theme)
    }, [color, theme])

    return (
        <>
            <BigModal onClose={handleClose}>
                <div className="p-10">
                    <span className="pointer" onClick={handleClose}>
                        <CloseIcon />
                    </span>
                </div>
                <hr />
                <div className="p-20">
                    <span className="font-800 font-xl block text-center">Customize your view</span>
                    <span className="block text-center mt-10 text-secondary">Manage your font size, color and background. These settings affect all the Twitter accounts on this browser.</span>
                </div>

                <div>
                    <span className="text-secondary font-2sm font-600 block pl-20 ml-10">Color</span>
                    <div className="display__color pb-10 w-90" >
                        <div className="flex-col items-center">
                            <>
                                <input type="radio" name="color" id="blue" className="colorInput" onClick={() => setColor("0")} />
                                <label htmlFor="blue" className="colorLabel" style={{ backgroundColor: "rgba(29,161,242,1.00)" }}></label>
                            </>
                            <img src="https://abs-0.twimg.com/emoji/v2/svg/1f499.svg" alt="" className="mt-10" width="25" height="25" />
                        </div>
                        <div className="flex-col items-center">
                            <>
                                <input type="radio" name="color" id="yellow" className="colorInput" onClick={() => setColor("1")} />
                                <label htmlFor="yellow" className="colorLabel" style={{ backgroundColor: "rgb(255, 173, 31)" }}></label>
                            </>
                            <img src="https://abs-0.twimg.com/emoji/v2/svg/2b50.svg" alt="" className="mt-10" width="25" height="25" />

                        </div>
                        <div className="flex-col items-center">
                            <>
                                <input type="radio" name="color" id="pink" className="colorInput" onClick={() => setColor("2")} />
                                <label htmlFor="pink" className="colorLabel" style={{ backgroundColor: "rgb(224, 36, 94)" }}></label>
                            </>
                            <img src="https://abs-0.twimg.com/emoji/v2/svg/1f338.svg" alt="" className="mt-10" width="25" height="25" />
                        </div>
                        <div className="flex-col items-center">
                            <>
                                <input type="radio" name="color" id="violet" className="colorInput" onClick={() => setColor("3")} />
                                <label htmlFor="violet" className="colorLabel" style={{ backgroundColor: "rgb(121, 75, 196)" }}></label>
                            </>
                            <img src="https://abs-0.twimg.com/emoji/v2/svg/1f419.svg" alt="" className="mt-10" width="25" height="25" />
                        </div>
                        <div className="flex-col items-center">
                            <>
                                <input type="radio" name="color" id="orange" className="colorInput" onClick={() => setColor("4")} />
                                <label htmlFor="orange" className="colorLabel" style={{ backgroundColor: "rgb(244, 93, 34)" }}></label>
                            </>
                            <img src="https://abs-0.twimg.com/emoji/v2/svg/1f525.svg" alt="" className="mt-10" width="25" height="25" />
                        </div>
                        <div className="flex-col items-center">
                            <>
                                <input type="radio" name="color" id="green" className="colorInput" onClick={() => setColor("5")} />
                                <label htmlFor="green" className="colorLabel" style={{ backgroundColor: "rgb(23, 191, 99)" }}></label>
                            </>
                            <img src="https://abs-0.twimg.com/emoji/v2/svg/1f951.svg" alt="" className="mt-10" width="25" height="25" />
                        </div>
                    </div>
                </div>

                <div className="mt-40">
                    <span className="text-secondary font-2sm font-600 block pl-20 ml-10">Background</span>
                    <div className="display__theme w-90 p-10" >
                        <label htmlFor="light">
                            <div className={`p-20 mr-10 ${theme === '0' && 'border-primary'}`} style={{ backgroundColor: "rgb(255, 255, 255)", borderRadius: "5px" }}>
                                <input type="radio" name="theme" id="light" onClick={() => setTheme("0")} />
                                <label htmlFor="light" className="ml-10 pl-10" style={{ color: "rgb(15, 20, 25)" }}>Light</label>
                            </div>
                        </label>
                        <label htmlFor="dim">
                            <div className={`p-20 mr-10 ${theme === '1' && 'border-primary'}`} style={{ backgroundColor: "rgb(21, 32, 43)", borderRadius: "5px" }}>
                                <input type="radio" name="theme" id="dim" onClick={() => setTheme("1")} />
                                <label htmlFor="dim" className="ml-20 pl-10" style={{ color: "rgb(255, 255, 255)" }}>dim</label>
                            </div>
                        </label>
                        <label htmlFor="dark">
                            <div className={`p-20 mr-10 ${theme === '2' && 'border-primary'}`} style={{ backgroundColor: "rgb(0, 0, 0)", borderRadius: "5px" }}>
                                <input type="radio" name="theme" id="dark" onClick={() => setTheme("2")} />
                                <label htmlFor="dark" className="ml-20 pl-10" style={{ color: "rgb(217, 217, 217)" }}>dark</label>
                            </div>
                        </label>

                    </div>
                </div>

                <div className="flex justify-center mt-40 mb-20">
                    <button className="fill-button text-white" onClick={handleClose}>Done</button>
                </div>
            </BigModal>
        </>
    )
}

export default Display
