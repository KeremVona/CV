import React from 'react'
import "./Navigationbar.css"

export default function NavigationBar() {
  return (
    <nav>
      <ul className="flex flex-row">
        <li className='basis-1/3'><a href="/home">Home</a></li>
        <li className='basis-1/3'><a href="/about">About</a></li>
        <li className='basis-1/3'><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  )
}
