---
title: "Operating System Security"
author: "S3vn Studies Team"
excerpt: "Operating system security is based on two principles:"
category: "financial-insight"
membershipRequired: "pro"
---

When you are a computer user, security is a big issue.  The developers of operating systems know that system security is important too.  That�s why all operating systems have built-in security features that make it safe to both navigate the Internet as well as keep unauthorized users from using your computer.

Operating system security is based on two principles:

* The operating system provides access to a number of resources, directly or indirectly such as files on a local disk, privileged system calls, personal information about users, and the services offered by the programs running on the system.
* The operating system is capable of distinguishing between some requesters of these resources who are authorized � or allowed � to access the resource, and others who are not authorized � or forbidden.  While some systems may simply distinguish between privileged and non-privileged, systems commonly have a form of requester identity such as a user name.

In addition to the allow/disallow model of security, an operating system with a high level of security will also offer auditing options.  These would allow tracking of requests for access to resources such as �who has been reading this file?�

Operating system security can further be broken down into two sub sections with regards to requesters:

* Internal Security � an already running program.  On some systems, a program once it is running has no limitations.  However, most commonly, the program does have an identity which it keeps and is used to check all of its requests for resources.
* External Security � a new request from outside the computer such as a log-in at a connected console or some kind of network connection.  To establish identity, there may be a process of authentication. 

Often a username must be quoted and each username may have a password.  Other methods of authentication, such as magnetic cards or biometric data might be used instead.  In some cases, especially with connections from a network, resources may be accessed with no authentication at all.

Operating system security has long been a concern because of highly sensitive data held on computers of personal, commercial, and even military nature.  That is why operating system programmers pay special attention to the security of the operating systems they are developing.  They want to insure that any delicate data contained on a system is kept private and is only allowed to be viewable by those who are authorized to do so.