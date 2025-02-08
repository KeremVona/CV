import React from 'react'
import NavigationBar from '../components/NavigationBar/NavigationBar'
import Header from '../components/Header/Header'

export default function Contact() {
  return (
    <>
        <NavigationBar />
        <Header header="Contact"/>
        <div>
            <ul className="flex flex-row">
              <li className="contact-li basis-1/2"><a href="https://github.com/KeremVona" target="_blank">Github</a></li>
              <li className="contact-li basis-1/2"><a href="https://www.linkedin.com/in/kerem-can-bas/" target="_blank">Linkedin</a></li>
            </ul>
        </div>
    </>
  )
}
