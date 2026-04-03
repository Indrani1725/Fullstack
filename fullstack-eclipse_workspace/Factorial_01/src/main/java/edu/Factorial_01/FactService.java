package edu.Factorial_01;

import org.springframework.stereotype.Service;

@Service
public class FactService {
	public long calculateFact(int n)
	{
		long fact = 1;
		for(int i =1; i<=n; i++)
		{
			fact = fact*i;
		}
		return fact;
	}

}
