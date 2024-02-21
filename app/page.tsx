"use server";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import fetchPulls from "./fetch";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CrownIcon } from "lucide-react";

export default async function Home() {
  const pulls = await fetchPulls();
  return (
    <>
      <header className="mx-auto max-w-lg mt-4 px-4">
        <h1 className="text-2xl font-semibold text-center">
          🤔 Who authored the longest PR?
        </h1>
        {/* <div className="flex flex-row-gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}
      </header>
      <main className="mx-auto p-4 max-w-lg flex flex-col gap-4">
        {pulls.map((pull, index) => (
          <Card key={pull.number}>
            <CardHeader>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-4 items-center">
                  <div className="font-medium text-primary flex flex-row gap-1 items-center">
                    {index === 0 ? (
                      <CrownIcon className="text-amber-400" />
                    ) : null}
                    {index === 1 ? (
                      <CrownIcon className=" text-neutral-600" />
                    ) : null}
                    {index === 2 ? (
                      <CrownIcon className=" text-amber-800" />
                    ) : null}
                    Rank #{index + 1}
                  </div>
                </div>
                {pull.author === null ? null : (
                  <Link
                    className="flex flex-row gap-1 items-center"
                    href={pull.author.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Avatar className="w-6 h-6 shadow-md">
                      <AvatarImage src={pull.author.avatar_url} />
                      <AvatarFallback>
                        {pull.author.login.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-muted-foreground">
                      @{pull.author.login}
                    </span>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-lg font-medium underline underline-offset-2">
                <Link href={pull.url} rel="noopener noreferrer" target="_blank">
                  {pull.title}
                </Link>
              </h2>
            </CardContent>
            <CardFooter className="grid grid-cols-6 gap-2 items-center">
              <p className="text-sm font-semibold">{pull.duration}</p>
              <div className="col-span-2 flex flex-row gap-1 items-center">
                <Badge variant="outline">{pull.state.toUpperCase()}</Badge>
                {pull.draft ? <Badge variant="outline">DRAFT</Badge> : null}
              </div>
              <p className="col-span-3 text-sm text-muted-foreground text-right">
                from{" "}
                <time className="font-semibold">
                  {new Date(pull.created_at).toLocaleDateString()}
                </time>{" "}
                to{" "}
                <time className="font-semibold">
                  {pull.merged_at !== null
                    ? new Date(pull.merged_at).toLocaleDateString()
                    : pull.closed_at !== null
                    ? new Date(pull.closed_at).toLocaleDateString()
                    : "today"}
                </time>
              </p>
            </CardFooter>
          </Card>
        ))}
      </main>
    </>
  );
}
