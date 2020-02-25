SELECT 
    date, 
    COUNT(*) occurrences
FROM hygiene_havel
GROUP BY
    date 
HAVING 
    COUNT(*) > 1;