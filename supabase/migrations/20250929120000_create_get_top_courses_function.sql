CREATE OR REPLACE FUNCTION get_top_courses()
RETURNS TABLE(course_id UUID, title TEXT, enrollment_count BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id as course_id,
    c.title,
    count(e.id) as enrollment_count
  FROM
    enrollments e
  JOIN
    courses c ON e.course_id = c.id
  GROUP BY
    c.id, c.title
  ORDER BY
    enrollment_count DESC
  LIMIT 5;
END;
$$;
