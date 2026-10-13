/**
 * Modular Job Recommendation Service
 * Compares student skills and preferences against job specifications
 */
export const calculateJobMatches = (userProfile, jobsList = []) => {
  const {
    skills = [],
    preferredJobRoles = [],
    preferredLocation = '',
  } = userProfile;

  const userSkillsLower = skills.map((s) => s.toLowerCase().trim());
  const userRolesLower = preferredJobRoles.map((r) => r.toLowerCase().trim());
  const userLocationLower = (preferredLocation || '').toLowerCase().trim();

  return jobsList
    .map((job) => {
      const required = job.requiredSkills || [];
      const requiredLower = required.map((r) => r.toLowerCase().trim());

      // 1. Skill Match Intersection
      const matched = required.filter((reqSkill) =>
        userSkillsLower.includes(reqSkill.toLowerCase().trim())
      );
      const missing = required.filter(
        (reqSkill) => !userSkillsLower.includes(reqSkill.toLowerCase().trim())
      );

      let baseScore =
        required.length > 0
          ? Math.round((matched.length / required.length) * 100)
          : 50;

      // 2. Role Preference Affinity Boost (up to +10%)
      const titleLower = job.title.toLowerCase();
      const roleMatched = userRolesLower.some(
        (prefRole) => titleLower.includes(prefRole) || prefRole.includes(titleLower)
      );
      if (roleMatched && baseScore < 95) {
        baseScore = Math.min(100, baseScore + 10);
      }

      // 3. Location Affinity Boost (up to +5%)
      if (
        userLocationLower &&
        (job.location.toLowerCase().includes(userLocationLower) ||
          job.location.toLowerCase().includes('remote'))
      ) {
        baseScore = Math.min(100, baseScore + 5);
      }

      // 4. Generate transparent match reasoning
      let reasonWhyMatched = '';
      if (matched.length === required.length && required.length > 0) {
        reasonWhyMatched = `Full skill match! You possess all ${required.length} required technical proficiencies for this position.`;
      } else if (matched.length > 0) {
        reasonWhyMatched = `Strong match: Your profile matches ${matched.length} of ${required.length} key requirements (${matched.join(', ')}).`;
        if (missing.length > 0) {
          reasonWhyMatched += ` Learning ${missing.slice(0, 2).join(' and ')} will close remaining qualification gaps.`;
        }
      } else {
        reasonWhyMatched = `Foundational match: Explore this role to discover emerging campus recruitment requirements.`;
      }

      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        experienceLevel: job.experienceLevel,
        description: job.description,
        applicationUrl: job.applicationUrl,
        source: job.source,
        isSampleData: job.isSampleData,
        requiredSkills: job.requiredSkills,
        matchedSkills: matched,
        missingSkills: missing,
        matchScore: baseScore,
        reasonWhyMatched,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};
