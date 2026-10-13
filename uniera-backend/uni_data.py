"""Extra university details used to seed the `university_details` table.

Matched to your existing `universities` rows by name keywords, so it works
even if your names are written slightly differently (e.g. "UNSW" vs
"University of New South Wales"). Universities not matched here still get
a generated profile, so every university page has content.
"""

DEFAULT_INTAKES = "February, July"

# (keywords that must ALL appear in the normalised name, details)
UNI_INFO = [
    (["unsw"], dict(established=1949, type="Public", group="Group of Eight", intakes="February, May, September (3 terms)",
        known_for="Engineering, Business, Computer Science, Law, Medicine",
        about="A leading research university in Kensington, Sydney, known for engineering, business and innovation.")),
    (["newsouthwales"], dict(established=1949, type="Public", group="Group of Eight", intakes="February, May, September (3 terms)",
        known_for="Engineering, Business, Computer Science, Law, Medicine",
        about="A leading research university in Kensington, Sydney, known for engineering, business and innovation.")),
    (["cquniversity"], dict(established=1967, type="Public", group="", intakes="March, July, November (3 terms)",
        known_for="Nursing, Engineering, IT, Business, Education",
        about="A regional university headquartered in Rockhampton with campuses across Australia.")),
    (["centralqueensland"], dict(established=1967, type="Public", group="", intakes="March, July, November (3 terms)",
        known_for="Nursing, Engineering, IT, Business, Education",
        about="A regional university headquartered in Rockhampton with campuses across Australia.")),
    (["melbourne"], dict(established=1853, type="Public", group="Group of Eight",
        known_for="Law, Medicine, Business, Engineering, Education",
        about="Australia's second-oldest university, known for its research strength and the graduate-focused Melbourne Model.")),
    (["sydney", "technology"], dict(established=1988, type="Public", group="",
        known_for="IT, Engineering, Design, Business, Data Science",
        about="A practice-oriented, industry-linked university in the heart of Sydney's tech and creative precinct.")),
    (["westernsydney"], dict(established=1989, type="Public", group="",
        known_for="Nursing, Education, Business, Engineering, Social Sciences",
        about="A multi-campus university across Greater Western Sydney with a strong focus on community and industry engagement.")),
    (["sydney"], dict(established=1850, type="Public", group="Group of Eight",
        known_for="Medicine, Law, Business, Architecture, Veterinary Science",
        about="Australia's first university, with a historic Camperdown campus and globally recognised research.")),
    (["nationaluniversity"], dict(established=1946, type="Public", group="Group of Eight",
        known_for="Politics, International Relations, Sciences, Economics, Asian Studies",
        about="Australia's national university in Canberra, founded by federal parliament with a strong research focus.")),
    (["monash"], dict(established=1958, type="Public", group="Group of Eight",
        known_for="Pharmacy, Medicine, Engineering, Business, IT",
        about="Australia's largest university, with its main campus at Clayton in Melbourne and campuses overseas.")),
    (["queensland", "technology"], dict(established=1989, type="Public", group="",
        known_for="Business, IT, Engineering, Creative Industries, Health",
        about="A 'university for the real world' in Brisbane with strong industry partnerships.")),
    (["southernqueensland"], dict(established=1967, type="Public", group="", intakes="February, July, November (3 trimesters)",
        known_for="Online Learning, Engineering, Education, Business, Nursing",
        about="A regional university based in Toowoomba, well known for flexible and online study.")),
    (["queensland"], dict(established=1909, type="Public", group="Group of Eight",
        known_for="Biotechnology, Medicine, Business, Engineering, Environmental Science",
        about="Queensland's oldest university, with its sandstone St Lucia campus beside the Brisbane River.")),
    (["westernaustralia"], dict(established=1911, type="Public", group="Group of Eight",
        known_for="Mining Engineering, Agriculture, Medicine, Business, Sciences",
        about="Western Australia's oldest university, set on the Swan River in Perth.")),
    (["adelaide"], dict(established=1874, type="Public", group="Group of Eight",
        known_for="Wine Science, Medicine, Engineering, Agriculture, Law",
        about="South Australia's oldest university, located on North Terrace in Adelaide's cultural precinct.")),
    (["macquarie"], dict(established=1964, type="Public", group="",
        known_for="Business Analytics, Accounting, Actuarial Studies, Linguistics, IT",
        about="A research-intensive university in Sydney's Macquarie Park, beside a major technology and business hub.")),
    (["newcastle"], dict(established=1965, type="Public", group="",
        known_for="Engineering, Medicine, Nursing, Education, Architecture",
        about="A regional university in the NSW Hunter region with campuses in Newcastle and Sydney.")),
    (["wollongong"], dict(established=1975, type="Public", group="",
        known_for="Engineering, IT, Business, Nursing, Creative Arts",
        about="A coastal regional university south of Sydney with strong graduate employment outcomes.")),
    (["charlessturt"], dict(established=1989, type="Public", group="",
        known_for="Agriculture, Veterinary Science, Teaching, IT, Policing",
        about="A multi-campus regional university across inland NSW, known for online and distance study.")),
    (["southerncross"], dict(established=1994, type="Public", group="", intakes="February, July, November (6-week term model)",
        known_for="Health, Tourism, Environmental Science, Business, Education",
        about="A regional university in northern NSW with campuses at Lismore, Coffs Harbour and the Gold Coast.")),
    (["newengland"], dict(established=1938, type="Public", group="", intakes="February, June, November (3 trimesters)",
        known_for="Agriculture, Education, Rural Science, Online Learning",
        about="A regional university in Armidale, NSW, with a long history of distance education.")),
    (["catholic"], dict(established=1991, type="Public", group="",
        known_for="Nursing, Teaching, Paramedicine, Theology, Physiotherapy",
        about="A public Catholic university with campuses across several Australian cities.")),
    (["rmit"], dict(established=1887, type="Public", group="",
        known_for="Art & Design, IT, Engineering, Architecture, Business",
        about="A global university of technology, design and enterprise in the Melbourne CBD.")),
    (["deakin"], dict(established=1974, type="Public", group="", intakes="March, July, November (3 trimesters)",
        known_for="Sport Science, IT, Nursing, Business, Engineering",
        about="A Victorian university with campuses in Melbourne, Geelong and Warrnambool, known for its online learning.")),
    (["latrobe"], dict(established=1964, type="Public", group="",
        known_for="Health Sciences, Business, IT, Agriculture, Psychology",
        about="A Melbourne-based university with a large bushland campus at Bundoora and regional campuses.")),
    (["swinburne"], dict(established=1908, type="Public", group="",
        known_for="Engineering, Design, IT, Aviation, Business",
        about="A technology-focused university in Hawthorn, Melbourne, with strong industry placements.")),
    (["victoria"], dict(established=1916, type="Public", group="", intakes="February, July (Block Model)",
        known_for="Sport, Business, IT, Nursing, Education",
        about="A dual-sector Melbourne university known for its Block Model, studying one unit at a time.")),
    (["federation"], dict(established=2014, type="Public", group="",
        known_for="IT, Nursing, Education, Engineering, Business",
        about="A regional Victorian university centred in Ballarat, with roots going back to 1870.")),
    (["griffith"], dict(established=1971, type="Public", group="", intakes="February, July, November (3 trimesters)",
        known_for="Hospitality, Criminology, Nursing, Business, Environmental Science",
        about="A South-East Queensland university with campuses in Brisbane and on the Gold Coast.")),
    (["jamescook"], dict(established=1970, type="Public", group="",
        known_for="Marine Biology, Tropical Medicine, Nursing, Environmental Science",
        about="A research university in tropical north Queensland, with campuses in Townsville and Cairns.")),
    (["sunshinecoast"], dict(established=1996, type="Public", group="", intakes="February, June, October (3 semesters)",
        known_for="Nursing, Sport Science, Environmental Science, Education, Business",
        about="A young regional university on Queensland's Sunshine Coast.")),
    (["bond"], dict(established=1987, type="Private", group="", intakes="January, May, September (3 semesters)",
        known_for="Law, Medicine, Business, Architecture, Film",
        about="Australia's first private, not-for-profit university on the Gold Coast, known for small classes.")),
    (["curtin"], dict(established=1966, type="Public", group="",
        known_for="Mining, Engineering, Business, Health Sciences, Architecture",
        about="Western Australia's largest university, based in Bentley, Perth, with global campuses.")),
    (["murdoch"], dict(established=1973, type="Public", group="",
        known_for="Veterinary Science, Law, IT, Environmental Science, Media",
        about="A Perth university with a large leafy campus, known for veterinary and environmental science.")),
    (["edithcowan"], dict(established=1991, type="Public", group="",
        known_for="Cyber Security, Nursing, Education, Performing Arts, Business",
        about="A Perth university with a strong teaching reputation and one of Australia's leading cyber security programs.")),
    (["notredame"], dict(established=1989, type="Private", group="",
        known_for="Medicine, Nursing, Law, Education, Business",
        about="A private Catholic university with campuses in Fremantle, Sydney and Broome.")),
    (["flinders"], dict(established=1966, type="Public", group="",
        known_for="Medicine, Nursing, Education, Psychology, Engineering",
        about="An Adelaide university with a hillside campus at Bedford Park and a strong health focus.")),
    (["southaustralia"], dict(established=1991, type="Public", group="",
        known_for="Pharmacy, Physiotherapy, Business, Engineering, Design",
        about="An industry-connected Adelaide university with campuses across the city.")),
    (["tasmania"], dict(established=1890, type="Public", group="",
        known_for="Marine & Antarctic Science, Agriculture, Medicine, Business",
        about="Australia's fourth-oldest university, based in Hobart with campuses across Tasmania.")),
    (["charlesdarwin"], dict(established=2003, type="Public", group="",
        known_for="Nursing, Engineering, Education, Indigenous Studies, IT",
        about="The Northern Territory's university, based in Darwin with a dual-sector model.")),
    (["canberra"], dict(established=1990, type="Public", group="",
        known_for="Health, Education, IT, Design, Politics",
        about="A Canberra university close to government, with strong professional placements.")),
]


def find_info(name):
    n = "".join(ch for ch in (name or "").lower() if ch.isalnum())
    for keys, info in UNI_INFO:
        if all(k in n for k in keys):
            return info
    return None


# Standard course catalogue; levels are matched by keyword to your tuition_base levels.
COURSE_CATALOGUE = {
    "masters": [
        ("Master of Information Technology", "IT", 2),
        ("Master of Business Analytics", "Business", 1.5),
        ("Master of Data Science", "IT", 2),
        ("Master of Business Administration (MBA)", "Business", 2),
        ("Master of Professional Accounting", "Business", 2),
        ("Master of Engineering", "Engineering", 2),
        ("Master of Cyber Security", "IT", 2),
        ("Master of Public Health", "Health", 2),
        ("Master of Nursing", "Health", 2),
        ("Master of Project Management", "Business", 2),
    ],
    "bachelors": [
        ("Bachelor of Computer Science", "IT", 3),
        ("Bachelor of Business", "Business", 3),
        ("Bachelor of Engineering (Honours)", "Engineering", 4),
        ("Bachelor of Nursing", "Health", 3),
        ("Bachelor of Commerce", "Business", 3),
        ("Bachelor of Information Technology", "IT", 3),
    ],
    "phd": [
        ("Doctor of Philosophy (PhD) – Research", "Research", 3),
        ("Master of Philosophy (MPhil)", "Research", 2),
    ],
    "diploma": [
        ("Diploma of Business", "Business", 1),
        ("Diploma of Information Technology", "IT", 1),
    ],
}


def level_key(level):
    l = (level or "").lower()
    if "master" in l or "postgrad" in l or l in ("pg",):
        return "masters"
    if "bach" in l or "under" in l or l in ("ug",):
        return "bachelors"
    if "phd" in l or "doct" in l or "research" in l:
        return "phd"
    if "diploma" in l:
        return "diploma"
    return None
