-- =====================================================================
-- SAMPLE DATA — only for a brand-new, EMPTY database.
-- Do NOT run this on your existing uniera database (it would duplicate rows).
-- Figures are indicative averages for demo purposes.
-- =====================================================================
USE uniera;

INSERT INTO cities (city, state, is_regional, tuition_index, living_cost_aud) VALUES
('Sydney','NSW',0,1.10,29710),('Melbourne','VIC',0,1.05,27500),('Brisbane','QLD',0,1.00,25000),
('Perth','WA',0,0.98,24500),('Adelaide','SA',1,0.95,23000),('Canberra','ACT',0,1.05,26000),
('Hobart','TAS',1,0.90,22000),('Darwin','NT',1,0.90,23500),('Gold Coast','QLD',1,0.97,24500),
('Newcastle','NSW',1,0.95,24000),('Wollongong','NSW',1,0.95,24000),('Geelong','VIC',1,0.95,23500),
('Townsville','QLD',1,0.90,22000),('Toowoomba','QLD',1,0.88,21500),('Rockhampton','QLD',1,0.88,21000),
('Armidale','NSW',1,0.88,21000),('Lismore','NSW',1,0.88,21000),('Wagga Wagga','NSW',1,0.88,21000),
('Ballarat','VIC',1,0.88,21500),('Sunshine Coast','QLD',1,0.92,23000),('Fremantle','WA',0,0.98,24500);

INSERT INTO tuition_base (level, tuition_min_aud, tuition_max_aud) VALUES
('Bachelors',30000,48000),('Masters',32000,52000),('PhD',30000,50000);

INSERT INTO fixed_costs VALUES (1,700,2000,1500,3000);

INSERT INTO universities (name, city, state, uni_tier, website) VALUES
('The University of Melbourne','Melbourne','VIC','Group of Eight','https://www.unimelb.edu.au'),
('The University of Sydney','Sydney','NSW','Group of Eight','https://www.sydney.edu.au'),
('UNSW Sydney','Sydney','NSW','Group of Eight','https://www.unsw.edu.au'),
('Australian National University','Canberra','ACT','Group of Eight','https://www.anu.edu.au'),
('Monash University','Melbourne','VIC','Group of Eight','https://www.monash.edu'),
('The University of Queensland','Brisbane','QLD','Group of Eight','https://www.uq.edu.au'),
('The University of Western Australia','Perth','WA','Group of Eight','https://www.uwa.edu.au'),
('The University of Adelaide','Adelaide','SA','Group of Eight','https://www.adelaide.edu.au'),
('University of Technology Sydney','Sydney','NSW','Mid-tier','https://www.uts.edu.au'),
('Macquarie University','Sydney','NSW','Mid-tier','https://www.mq.edu.au'),
('Western Sydney University','Sydney','NSW','Mid-tier','https://www.westernsydney.edu.au'),
('University of Newcastle','Newcastle','NSW','Regional','https://www.newcastle.edu.au'),
('University of Wollongong','Wollongong','NSW','Regional','https://www.uow.edu.au'),
('Charles Sturt University','Wagga Wagga','NSW','Regional','https://www.csu.edu.au'),
('Southern Cross University','Lismore','NSW','Regional','https://www.scu.edu.au'),
('University of New England','Armidale','NSW','Regional','https://www.une.edu.au'),
('Australian Catholic University','Sydney','NSW','Mid-tier','https://www.acu.edu.au'),
('RMIT University','Melbourne','VIC','Mid-tier','https://www.rmit.edu.au'),
('Deakin University','Geelong','VIC','Regional','https://www.deakin.edu.au'),
('La Trobe University','Melbourne','VIC','Mid-tier','https://www.latrobe.edu.au'),
('Swinburne University of Technology','Melbourne','VIC','Mid-tier','https://www.swinburne.edu.au'),
('Victoria University','Melbourne','VIC','Mid-tier','https://www.vu.edu.au'),
('Federation University Australia','Ballarat','VIC','Regional','https://www.federation.edu.au'),
('Queensland University of Technology','Brisbane','QLD','Mid-tier','https://www.qut.edu.au'),
('Griffith University','Brisbane','QLD','Mid-tier','https://www.griffith.edu.au'),
('James Cook University','Townsville','QLD','Regional','https://www.jcu.edu.au'),
('CQUniversity','Rockhampton','QLD','Regional','https://www.cqu.edu.au'),
('University of Southern Queensland','Toowoomba','QLD','Regional','https://www.unisq.edu.au'),
('University of the Sunshine Coast','Sunshine Coast','QLD','Regional','https://www.usc.edu.au'),
('Bond University','Gold Coast','QLD','Mid-tier','https://bond.edu.au'),
('Curtin University','Perth','WA','Mid-tier','https://www.curtin.edu.au'),
('Murdoch University','Perth','WA','Mid-tier','https://www.murdoch.edu.au'),
('Edith Cowan University','Perth','WA','Mid-tier','https://www.ecu.edu.au'),
('The University of Notre Dame Australia','Fremantle','WA','Mid-tier','https://www.notredame.edu.au'),
('Flinders University','Adelaide','SA','Regional','https://www.flinders.edu.au'),
('University of South Australia','Adelaide','SA','Regional','https://www.unisa.edu.au'),
('University of Tasmania','Hobart','TAS','Regional','https://www.utas.edu.au'),
('Charles Darwin University','Darwin','NT','Regional','https://www.cdu.edu.au'),
('University of Canberra','Canberra','ACT','Mid-tier','https://www.canberra.edu.au');

INSERT INTO eligibility_criteria (level, uni_tier, min_percentage, min_ielts, min_funds_aud, notes) VALUES
('Masters','Group of Eight',70,6.5,75000,'Competitive entry; strong academic record and relevant background preferred.'),
('Masters','Mid-tier',60,6.5,65000,'Most business and IT masters accept any bachelor degree.'),
('Masters','Regional',55,6.0,55000,'Regional study adds post-study work rights.'),
('Bachelors','Group of Eight',80,6.5,80000,'Based on Year 12 results.'),
('Bachelors','Mid-tier',65,6.0,70000,'Foundation pathways available.'),
('Bachelors','Regional',55,6.0,60000,'Diploma pathways available.'),
('PhD','Group of Eight',75,6.5,70000,'Research proposal and supervisor support required.'),
('PhD','Mid-tier',65,6.5,65000,'Research proposal required.'),
('PhD','Regional',60,6.5,60000,'Research proposal required.');

INSERT INTO scholarships (university_id, name, level, field, amount_aud, coverage, min_percentage, min_ielts, deadline, apply_link, description) VALUES
(NULL,'Australia Awards Scholarship','Masters','Any',120000,'Full',65,6.5,'2027-04-30','https://www.dfat.gov.au/people-to-people/australia-awards','Government-funded full tuition, living allowance and travel.'),
(1,'Melbourne International Undergraduate Scholarship','Bachelors','Any',40000,'Partial',85,6.5,NULL,'https://scholarships.unimelb.edu.au','Fee remission for high-achieving international students.'),
(2,'Sydney International Student Award','Masters','Any',40000,'Partial',75,6.5,NULL,'https://www.sydney.edu.au/scholarships','20% tuition reduction for the duration of the degree.'),
(10,'Vice-Chancellor''s International Scholarship','Masters','Business',10000,'Partial',70,6.5,'2027-03-31','https://www.mq.edu.au/study/scholarships','Up to A$10,000 towards tuition.'),
(10,'Macquarie Data Science Excellence Award','Masters','IT',15000,'Partial',65,6.5,'2027-02-28','https://www.mq.edu.au/study/scholarships','For analytics and data science masters students.'),
(9,'UTS Global Academic Excellence','Masters','Engineering',25000,'Partial',75,6.5,NULL,'https://www.uts.edu.au/scholarships','25% tuition remission.'),
(18,'RMIT Postgraduate International Scholarship','Masters','IT',10000,'Partial',65,6.5,'2027-01-15','https://www.rmit.edu.au/students/careers-opportunities/scholarships','A$10,000 one-off.'),
(19,'Deakin Vice-Chancellor''s Meritorious Scholarship','Masters','Any',80000,'Full',80,7.0,'2027-06-30','https://www.deakin.edu.au/scholarships','100% tuition for the course.'),
(24,'QUT International Merit Scholarship','Masters','Business',20000,'Partial',70,6.5,NULL,'https://www.qut.edu.au/study/fees-and-scholarships','25% tuition for full course.'),
(31,'Curtin International Scholarship – Merit','Masters','Engineering',15000,'Partial',65,6.5,NULL,'https://scholarships.curtin.edu.au','25% of first-year tuition.');
