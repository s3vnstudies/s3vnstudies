---
title: "Real Time Operating System"
author: "S3vn Studies Team"
excerpt: "Such applications include embedded systems like programmable thermostats, household appliance controllers, and mobile telephones.  Other applications"
category: "financial-insight"
membershipRequired: "pro"
---

A real-time operating system (RTOS) is a multitasking operating system intended for real-time applications.  Real-time applications are ones that are subject to a �real-time� constraint.  Let�s use the anti-lock brakes on a car as an example of a real-time computing system.  The real-time constraint with brakes would be the short time the brakes must be released to prevent the brakes from locking.

Such applications include embedded systems like programmable thermostats, household appliance controllers, and mobile telephones.  Other applications are industrial robots, spacecraft, industrial control, and scientific research equipment.

A real time operating system facilitates the creation of a real-time system but does not guarantee the final result will be real-time.  This requires correct development of the software.  An RTOS does not necessarily have high through put.  Rather, an RTOS provides facilities which, if used properly, guarantee deadlines can be met general or deterministically.

An RTOS will typically use specialized scheduling algorithms in order to provide the real-time developer with the tools necessary to produce deterministic behavior in the final system.  A real time operating system is valued more for how quickly and/or predictably it can respond to a particular even than for the given amount of work it can perform over time.  Key factors include minimal interrupt latency and a minimal thread switching latency.

A system is said to be real-time is the correctness of an operation depends not only upon the logical correctness of the operation but also upon the time at which it is performed.  The classical conception is that in a hard or immediate real-time system, the completion of an operation after its deadline is considered useless.  Ultimately this may lead to a critical failure of the complete system.  A soft real-time system on the other hand will tolerate such lateness and may respond with decreased service quality.

For example, a car engine control system is a hard real-time system.  That�s because a delayed signal may cause engine failure or damage.  Other examples of hard real-time embedded systems also include medical systems like heart pacemakers and industrial process controllers.  Hard real-time operating systems are used when it is imperative that an event is reacted to within a strict deadline.

A soft real time operating system could be like the software that maintains and updates the flight plans for commercial airliners. These can operate to a latency of seconds. It would not be possible to offer modern commercial air travel if these computations could not reliably be performed in real time. Live audio-video systems are also usually soft real-time; violation of constraints results in degraded quality, but the system can continue to operate.

Most people don�t think about real-time operating systems, but they are really an important part of your computer system.