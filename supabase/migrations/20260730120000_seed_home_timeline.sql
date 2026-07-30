-- Keep the editable homepage timeline reproducible on every environment.
insert into public.portfolio_timeline_entries (category, period, title, organisation, description, status, sort_order)
select category, period, title, organisation, description, 'published', sort_order
from (
  values
    ('experience', 'Now', 'Founder & CEO', 'Bruxlix', 'Building a patent-pending ML wearable for at-home sleep bruxism detection.', 10),
    ('experience', 'Now', 'Research Intern', 'STRIDE Lab · University of South Carolina', 'Exploring agentic AI and multi-agent reinforcement learning.', 20),
    ('experience', '2025', 'Inventor in Residence', 'InventX · IIT Gandhinagar', 'Prototyping, validating, and taking early ideas seriously.', 30),
    ('experience', '2025', 'Website Developer', 'HackJKLU v4.0', 'Led a 10-person team building the event’s digital experience.', 40),
    ('award', '2026', '1st Place', 'SDG Innovation Challenge · MUJ', 'Recognised for Bruxlix’s potential SDG 3 impact.', 10),
    ('award', '2025', 'Special Jury Award', 'InventX · IIT Gandhinagar', 'For turning a difficult health problem into a real prototype.', 20),
    ('award', '2025', 'ISRO Challenge Finalist', 'Immersion Startup Challenge', 'Selected among 16 innovators nationwide.', 30),
    ('award', '2025', 'Samsung ISWDP Fellow', 'Cohort 5', 'Selected from more than 3,000 applicants.', 40)
) as seed(category, period, title, organisation, description, sort_order)
where not exists (select 1 from public.portfolio_timeline_entries);
