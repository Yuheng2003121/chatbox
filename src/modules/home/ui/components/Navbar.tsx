"use client"
import ToggleTheme from '@/components/ToggleTheme'
import { Button } from '@/components/ui/button'
import UserControl from '@/components/UserControl'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
export default function Navbar() {
  return (
    <nav className="py-4 px-8 absolute top-0 left-0 right-0 z-50 border-b bg-transparent flex justify-between">
      <Link href="/" className="flex gap-2 items-center">
        <Image src={"/aiLogo.svg"} alt="Vibe" width={38} height={38} />
        <h1 className="text-lg md:text-xl font-bold ">Vibe</h1>
      </Link>

      <div className='flex gap-6'>
        <ToggleTheme/>
        <SignedOut>
          <div className="flex gap-2">
            <SignUpButton>
              <Button variant={"outline"} size={"sm"}>
                Sign Up
              </Button>
            </SignUpButton>

            <SignInButton>
              <Button variant={"outline"} size={"sm"}>
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserControl showName={true} />
        </SignedIn>
      </div>
    </nav>
  );
}
