---
title: "Night Shift Ends Soon [FORENSIC]"
categories: CodeCombat2023
permalink: /ctfs/codecombat2023/nightshiftendssoon
---

DNS Packet PCAP Analysis

## 📁 Challenge Description
>Ahmad was on his night shift when he remotely via the monitoring console, observed an unusual network activity from a user's segment of one of the branch offices. It is strange to see someone still in the branch office at this time. After consulting his other team member on duty, Ahmad decided to run a packet capture, capturing packets from the machine. He did some analysis on the captured packet, but he couldn't find anything suspicious - maybe someone was actually still in office during that time. His shift is ending soon. He needs to get someone from the next shift to help with this. And that someone is you.
>
>Please access this artifact: `https://drive.google.com/file/d/1M0iVNeEGCxRzTEIkN03EwLE7NBidVcw/view`
>
>Password: `sibersiaga2023`
>
>Flag format: `sibersiaga{flag}`

125 points, 4 solves (1st 🩸)

## 🚩 Solution
When we have been given a `.pcapng` file, it would always be good to look into the protocol hierarchy to investigate which protocol we are most likely will be dealing with.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/0864d46f-97b1-4541-b6d3-e84125427ce4)

The most possible protocol will be dealing with `DNS` packets (3.7% Packets) as there are approximately 0.2% `HTTP` packets captured and packets such as `QUIC` and `TLS` (without any extra information given) are not worth deep diving in as they are encrypted packets.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/c0d157cd-911f-48bd-8629-5f081b0da011)

Roughly looking at it, there are quite a lot of DNS packets going on in Wireshark. Hence, we can utilize `tshark` to grab every hostname from all DNS packets in the given `.pcapng` file and save it into a new file `dns.txt`.

`tshark` is yet another alternative packet analysis tool but in command line interface (CLI). The advantage given is that it can be used together with other advanced tools such as `tr`, `awk`, `sed`, `cut`, `grep`, etc. during packet filtering.  

```
$ tshark -r pcap01.pcapng -f fields -e dns.qry.name | sed '/^$/d' | uniq > dns.txt
```

Looking into the `dns.txt` file, there are some hostnames encoded with a random format which possibly lead to a potential foothold. By playing around with those hostnames, there is one domain utterly interesting and catches my eye which is `a.thectf.site`.

```
┌──(kali㉿kali)-[~/codecombat2023]
└─$ cat dns.txt | grep 'a.thectf.site' | uniq
01-RFIE4RYNBINAUAAAAAGUSSCEKIAAAAMQAAAAAFQIAYAAAAHOEH.a.thectf.site
02-FL2AAAAAEXASCZOMAAAFRFAAABMJIBJFJCJ4AAAACW6SKEIFKH.a.thectf.site
03-RWXNLTWZDIZQBSSQLN2ABO2EAC3JQELGRAIWNCARM2EBCZUCCL.a.thectf.site
04-PE6ZXOARVDSOWSP4HOM33J4ZW6T5OUP2GL7IYE5GWX5PKRABCB.a.thectf.site
05-CBCBINACIEIAJQICIIIAIQNQQAIAIQIQFQQAIQIQYR7VCQECSQ.a.thectf.site
06-7PB62DWP5PW4H4HXGPACZIE7ZXOUXXQHTSCV376HZZXMHZORBY.a.thectf.site
07-4GT4JDXRKW7P4TJ3X4SEOLFTXR7TPIRUO7VFL2VZKL3LCUIMJU.a.thectf.site
08-JET6LA73CHMBUOURLRPEPHNVNUD6HD5V57RR22HYETBM5IJD7W.a.thectf.site
09-V7TPGEGPSBMA26PGBLCRZUKLV4MQWG2TN3WEL7FPZXUNKXOQBO.a.thectf.site
10-I3SFVBWGA7UYRIZBOCWVTL4WLBV4I4LXZRKONSQYGVC7ZVEI3D.a.thectf.site
11-UFUQ66SC3M3RLO22SR3DJLUY2RFWVCCJ3DTHRTFDOQ4QR7SPOP.a.thectf.site
12-BQQP5I2RWSTIHP4VYLBCRNOQYVRUQ3HYJ2KE2FFQIXFVINAST2.a.thectf.site
13-EEZNOIWUU6UC6ST6V4K2XNLSJPWXRDWG7RT6LSC2GZCPZJOXH2.a.thectf.site
14-IAFEQOQFSJP5JUVLXO45CQQPMJBZ523UIFA53DVPNKJK7K6YLK.a.thectf.site
15-HE5MEWZ2ZNVZZZMRV634ZY4U43SBHZJK5OLAINUY7J7KRS5UYQ.a.thectf.site
16-BNJYAOSTR4YJTREQPLNWTM4SN4EUPBCG7G6RFEN4NSHLW53MIZ.a.thectf.site
17-LJABBPJ4TFZ7WQR736ZU6NBWHSMUW7VPDGVV4TSAOJF626HW2Y.a.thectf.site
18-QLCOVLXSYRUBOE2MO5LS4TA7YZPDX5AEUSBJYCTWUHQWZB4F5M.a.thectf.site
19-S3YTILVFC2CUTOTT3VXPVIF6YRMQZDHK2U2GX4VXGOX6H2VOPD.a.thectf.site
20-SGI45SQPPXECPYQDJ34XSPLRSI3OFCHM7WAIPVSEEQEQ42TQUK.a.thectf.site
21-E2W2QDKLPJMR3XDA5ASM7FLTDX3KXMBGLJAHEMSPJLLU4NB7NX.a.thectf.site
22-ID5EOYFDE6Z6N5K2WCEOIBZEWTLY6ZLOB7QYR65TISWHK6IHOR.a.thectf.site
23-DPIQPFIH6XJOEBUKOFKJP25NHM6GYHHFBVQL7RNDEI6HJONVDJ.a.thectf.site
24-JHKVACFR2UMMQTDNWKI2RTD2OIULTHL2VN5B5FNQ26BCPVKFDG.a.thectf.site
25-ERET4C2JH7NKTF4O7JFHVSLVXNQT7GMQKJTMHHM3WID47QZ5XV.a.thectf.site
26-ZDFJYM34PJRABM7OQLDYOJ5T432VVMEI4QDSJNGXRTSGXT3ILS.a.thectf.site
27-TM6HE5KUBUD4DDYWSLRWKB7UTWP6C3WCWR2YYPCQEYRZMNV7EL.a.thectf.site
28-ZFL6CQFUQWZYTWXSG4VIRTHK6T3SGUAGCUAFA7RSHDXHO6TGDX.a.thectf.site
29-WFHI7GP2FTZ6YVRH44WHXP6AM44J5H6UM3VDFTZZAM6V2SC2VA.a.thectf.site
30-GT3PNM4KITFMP2KDDQFG5TFGLYF36QISRWKRS7RIRPNCOGYZNN.a.thectf.site
31-RS4I37X4MKU2CO6NYURTT2ITLHRP7LGPWBNJA6VDXIQXXJ3TY7.a.thectf.site
32-2ZWL7NDI2UIATOGQLT4FS47VIJEQ4UOEUR52VZNTE3DKF22TMF.a.thectf.site
33-JQQAQH3EALE5TILXZYZGOYBCLJKYERHYJSM6AXQKBF3ALZFY5I.a.thectf.site
34-FUIL5ZZG3EYMPLX2YYA2EZKOB535CB5QJY3DM4ZRI36X4NKU2C.a.thectf.site
35-OIATJCWXQRWWPC7EAJUQVDXCLPNO5SOVZEOTCNEOOTJAWMI4BK.a.thectf.site
36-5KYK255AKM5JOFAJXDZACFES7GJUS3ZUNI3QB7ADQE4EJT2UQ3.a.thectf.site
37-DPWPMS3L6B5RYAO7C7HEIEJ6SESNTAU56R5MGF4IL2OQR7QEET.a.thectf.site
38-SFIOCGTWGXH6BRVALSF45ENQTTXSROMCP2QT6RULT23OYTVNEE.a.thectf.site
39-4QDSJPWXQLVNIF6LCNH7X2T5L32ACDORDPNC7ET6PL2L55AE4J.a.thectf.site
40-PEJUAH3Q3BOZDK3IPZ673ER2IWS36LZPHCTAFM62INYPPZCWMP.a.thectf.site
41-ORTZPMIYM6B5MLNMHUZRVFXYPAC2IV72RSC25ZFJT2LZZELWXT.a.thectf.site
42-AKPSMM3OS4SKQVHKNJPYP3RAGRDPMWRTH23ZFWCW5OWQP5H5TU.a.thectf.site
43-GTZP2QL5M3M47ZBIYIJ66VSEN7C6FNLL3HAQZEWTLY6Z2MO7DB.a.thectf.site
44-N6GW3DL6IX5GLO5KC6RA6KRP6CAWCBIJ7PU2IUOW7TL3PYYJ4R.a.thectf.site
45-JASF2QFA56AZBYWGRXOOVMVI6RGXIEUJIT5E56UWN6RP6ZD2GT.a.thectf.site
46-4M2IEE537BMFUJIQRH2BWFPYFYWIAIQIQPQ47OARARABALBBAR.a.thectf.site
47-ABGBAJBBABCB7QAPYAUWN2JAHLOVF72QAAAAABEUKTSEVZBGBA.a.thectf.site
48-Q=.a.thectf.site
d1bfe-48.a.thectf.site
a87de-0.a.thectf.site
```

We discovered that every subdomain of `a.thectf.site` can be decoded using **BASE 32**. The decoded string is actually `PNG` raw binaries. Hence, every subdomain had also been given an identifier stating the order in which the string should be placed. Therefore, these raw binary strings can be pieced together to reconstruct a `PNG` image.

All the reconstruction processes can be done with the power of CLI tools.

I will ~~use some algebraic representations to~~ explain the tools I will be using to get the image easily.

```
$ cat dns.txt | grep 'a.thectf.site' == cmd1 # filter hostnames that only have a.thectf.site.
$ cmd1 | uniq == cmd2                        # filter repetitive hostnames.
$ cmd2 | cut -d. -f1 | cut -d- -f2 == cmd3   # keep only the encoded subdomains and remove other information.
$ cmd3 | tr -d "\n\r" == cmd4                # remove new lines.
$ cmd4 | sed 's/.\{3\}$//' == cmd5           # remove the last 3 lines (include the last empty line).
$ cmd5 | base32 -d > flag.png == cmd6        # decode using base32 and save it to flag.png.
$ cmd6 && eog flag.png                       # view the content of flag.png.
```

Final command.

```
$ cat dns.txt | grep 'a.thectf.site' | uniq | cut -d. -f1 | cut -d- -f2 | tr -d "\n\r" | sed 's/.\{3\}$//' | base32 -d > flag.png && eog flag.png
```

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/8be47323-77b2-4301-aee6-6abcf0de1a76)

Hence, this proved our path is correct and the flag is revealed.

***FLAG***: `sibersiaga{9838471a326513ca81498eb844ade8a9}`
